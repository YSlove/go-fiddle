import * as moment from 'moment';
import * as React from 'react';
import JsonView from 'react-json-view';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Expander from '../expander/Expander';
import { MessageDetails, MessageHeader } from '../models/Message';
import RawMessageDetails from './RawMessageDetails';

const DATE_FORMAT = 'dddd D MMMM YYYY HH:mm:ss.SSS';

function createDefinition(name: string, value: string | null) {
  if (value === null) { return null };

  return (
    <div className="property">
      <dt>{name}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function mapHeaders(headers: MessageHeader[]) {
  return headers.map((h, i) => (
    <div className="property" key={i}>
      <dt>{h.name}</dt>
      <dd>{h.value}</dd>
    </div>
  ));
}

function getUri(message: MessageDetails) {
  if (!message || !message.request) { return null };

  if (/^https?:\/\//i.test(message.request.uri)) {
    return message.request.uri;
  }

  const host = getHeaderValue(message.request.headers, 'host');
  if (host) {
    return `https://${host}${message.request.uri}`;
  }

  return null;
}

function getHeaderValue(headers: MessageHeader[], name: string) {
  const header = headers.filter(h => h.name.toLowerCase() === name.toLowerCase())[0];
  if (header) {
    return header.value;
  }
  return null;
}

interface Props {
  message?: MessageDetails;
}

class MessagesDetails extends React.Component<Props> {
  private getPreviewContent() {
    const { message } = this.props;

    if (!message || !message.response || !message.response.body) { return null };

    const contentType = getHeaderValue(message.response.headers, 'content-type');

    if (!contentType) { return null };

    if (/\bjson\b/i.test(contentType)) {
      return (
        <div className="json-view">
          <JsonView src={JSON.parse(message.response.body)} name={false} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
        </div>
      );
    }

    if (/^text\/(html|xml)/i.test(contentType)) {
      return (
        <div className="xml-view">
          <SyntaxHighlighter language="html" customStyle={{
            backgroundColor: '#f2f2f2',
            border: '1px solid #ccc',
            borderRadius: '5px',
            minHeight: '10rem',
            padding: '5px',
          }}>{message.response.body}</SyntaxHighlighter>
        </div>
      );
    }

    if (/^image\//i.test(contentType)) {
      return (
        <div className="image-view">
          <img src={`data:${contentType};base64,${message.response.body64}`} alt="preview" />
        </div>
      );
    }

    return <pre className="raw">{message.response.body}</pre>;
  }

  public render() {
    let { message } = this.props;
    if (!message) { message = {} };

    return (
      <div className="MessageDetails">
        <Tabs>
          <TabList>
            <Tab>Headers</Tab>
            <Tab>Preview</Tab>
            <Tab>Raw</Tab>
          </TabList>

          <TabPanel>
            <div style={{display: this.props.message ? 'block' : 'none'}}>
              <Expander title="General">
                <dl className="properties">
                  {createDefinition('URL', getUri(message))}
                  {createDefinition('Method', message.request ? message.request.method : null)}
                  {createDefinition('Status Code', message.response ? `${message.response.statuscode} ${message.response.statustext}` : null)}
                  {createDefinition('Time', message.request ? moment(message.request.timestamp / 1000000).format(DATE_FORMAT) : null)}
                  {createDefinition('Duration', message.request && message.response ? `${Math.round((message.response.timestamp - message.request.timestamp) / 1000000)}ms` : null)}
                  {createDefinition('Client IP', message.request && message.request.clientip ? message.request.clientip : null)}
                </dl>
              </Expander>
              <Expander title="Request">
                <dl className="properties">
                  {mapHeaders(message.request ? message.request.headers : [])}
                </dl>
              </Expander>
              { message.response ?
                <Expander title="Response">
                  <dl className="properties">
                    {mapHeaders(message.response ? message.response.headers : [])}
                  </dl>
                </Expander>
                : null
              }
            </div>
          </TabPanel>
          <TabPanel>
            {this.getPreviewContent()}
          </TabPanel>
          <TabPanel>
            <RawMessageDetails message={this.props.message} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default MessagesDetails;
