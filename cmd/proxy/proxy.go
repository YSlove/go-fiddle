package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"regexp"
	"time"

	"go-fiddle/cmd/config"
	"go-fiddle/cmd/internal/database"
	"go-fiddle/cmd/internal/kafkaserver"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/elazarl/goproxy"
	"github.com/satori/go.uuid"
	"gopkg.in/mgo.v2/bson"
)

func main() {
	caConfigured := configureCA()
	proxy := goproxy.NewProxyHttpServer()
	kafkaProducer := kafkaserver.NewProducer()

	session := database.GetDatabaseConnection()
	defer session.Close()
	// session.SetMode(mgo.Monotonic, true)
	collection := database.GetDatabaseCollection(session, "messages")

	if caConfigured {
		proxy.OnRequest(goproxy.ReqHostMatches(regexp.MustCompile("^.*$"))).
			HandleConnect(goproxy.AlwaysMitm)
	}

	proxy.OnRequest(shouldInterceptRequest()).DoFunc(
		func(r *http.Request, ctx *goproxy.ProxyCtx) (*http.Request, *http.Response) {
			topic := "request"
			url := r.URL.String()
			log.Print(url)

			httpMessage := HTTPMessage{}
			request, _ := httputil.DumpRequest(r, false)
			requestID, _ := uuid.NewV4()
			messageID := fmt.Sprintf("%x", requestID.Bytes())
			timestamp := time.Now().UnixNano()

			ctx.UserData = map[string]string{"requestID": messageID}

			httpRequest := unmarshalHTTPRequest(request)
			httpRequest.Timestamp = timestamp

			buf, _ := ioutil.ReadAll(r.Body)
			responseStream := ioutil.NopCloser(bytes.NewBuffer(buf))
			r.Body = responseStream

			httpRequest.Body = buf

			clientIP := r.RemoteAddr
			remoteAddress := regexp.MustCompile(`^\[?([^\]]+)\]?:(\d+)$`).FindStringSubmatch(clientIP)
			if remoteAddress != nil {
				clientIP = remoteAddress[1]
			}

			httpRequest.ClientIP = clientIP

			httpMessage.ID = messageID
			httpMessage.Request = httpRequest

			go func() {
				err := collection.Insert(httpMessage)

				if err != nil {
					log.Printf("Database write error for request: %s", err)
				}
			}()

			if jsonMessage, err := json.Marshal(summariseMessage(httpMessage)); err == nil {
				kafkaProducer.Produce(&kafka.Message{
					TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
					Value:          jsonMessage,
				}, nil)
			}

			// get stubbed response (a nil response indicates that request should not be stubbed and response should come from actual source)
			return r, stubResponse(r)
		})

	proxy.OnResponse(shouldInterceptResponse()).DoFunc(
		func(r *http.Response, ctx *goproxy.ProxyCtx) *http.Response {
			httpResponse, _ := httputil.DumpResponse(r, false)
			buf, _ := ioutil.ReadAll(r.Body)
			responseStream := ioutil.NopCloser(bytes.NewBuffer(buf))
			httpMessage := HTTPMessage{}

			r.Body = responseStream

			timestamp := time.Now().UnixNano()
			topic := "response"

			userData, ok := ctx.UserData.(map[string]string)
			if !ok {
				log.Print("Error reading user data")
				return r
			}

			requestID := userData["requestID"]
			err := collection.FindId(requestID).One(&httpMessage)

			if err != nil {
				log.Printf("Response find (%s) error: %s", requestID, err)
				return r
			}

			response := unmarshalHTTPResponse(httpResponse)
			response.Timestamp = timestamp
			httpMessage.Response = response
			httpMessage.Response.Body = buf

			go func() {
				err := collection.Update(bson.M{"_id": requestID}, httpMessage)

				if err != nil {
					log.Printf("Database write error for response (%s): %s", requestID, err)
				}
			}()

			if jsonMessage, err := json.Marshal(summariseMessage(httpMessage)); err == nil {
				kafkaProducer.Produce(&kafka.Message{
					TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
					Value:          jsonMessage,
				}, nil)
			}

			return r
		})

	port := config.Get("PORT", "8080")
	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), proxy))
}

func shouldInterceptRequest() goproxy.ReqConditionFunc {
	return func(req *http.Request, ctx *goproxy.ProxyCtx) bool {
		// TODO: query config for whether or not request should be intercepted and logged
		return true
	}
}

func shouldInterceptResponse() goproxy.RespConditionFunc {
	return func(res *http.Response, ctx *goproxy.ProxyCtx) bool {
		// TODO: query config for whether or not request should be intercepted and logged
		return true
	}
}

func stubResponse(req *http.Request) *http.Response {
	// TODO: load stubbing rules from configuration
	// if regexp.MustCompile("stub").MatchString(req.RequestURI) {
	// 	return goproxy.NewResponse(req, goproxy.ContentTypeText, http.StatusOK, "Stubbed")
	// }
	return nil
}
