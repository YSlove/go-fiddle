export interface MessageSummary {
  id: string;
  uri: string;
  method: string;
  statuscode: string;
  timestamp: number;
}

export interface MessageDetails {
  id?: string;
  request?: MessageRequest;
  response?: MessageResponse;
}

export interface MessageRequest {
  method: string;
  uri: string;
  version: string;
  timestamp: number;
  headers: MessageHeader[];
  clientip: string;
  body: string;
  body64: string;
}

export interface MessageResponse {
  statuscode: string,
  statustext: string;
  version: string;
  timestamp: number;
  headers: MessageHeader[];
  body: string;
  body64: string;
}

export interface MessageHeader {
  name: string;
  value: string;
}
