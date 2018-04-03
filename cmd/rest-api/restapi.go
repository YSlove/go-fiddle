package main

import (
	"fmt"
	"log"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"go-fiddle/internal/config"
	"go-fiddle/internal/kafkaclient"

	"gopkg.in/mgo.v2"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	session, _ := mgo.Dial(config.Get("MONGODB", "mongodb://localhost"))
	defer session.Close()
	// session.SetMode(mgo.Monotonic, true)

	kafkaClient := kafkaclient.NewConsumer(func(msg *kafka.Message) {
		message := string(msg.Value)
		collection := session.DB("gofiddle").C("messages")

		if *msg.TopicPartition.Topic == "request" {
			requestID, request := UnmarshalHTTPRequest(msg.Value)
			httpMessage := HTTPMessage{requestID, request, nil}

			err := collection.Insert(httpMessage)

			if err != nil {
				log.Fatal(err)
			}
		} else if *msg.TopicPartition.Topic == "response" {
			requestID, response := UnmarshalHTTPResponse(msg.Value)

			var httpMessage *HTTPMessage
			err := collection.FindId(requestID).One(&httpMessage)

			if err != nil {
				log.Fatal(err)
			}

			httpMessage.Response = response
			err = collection.Update(bson.M{"_id": requestID}, httpMessage)

			if err != nil {
				log.Fatal(err)
			}
		}
		log.Printf("Message received %v\n%s\n", msg.TopicPartition, message)
	})

	port := config.Get("PORT", "8888")
	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), router))

	kafkaClient.Close()
}