import config from '../config';
import * as mongodb from 'mongodb';
import * as restify from 'restify';

function getHeaderValue(headers: Array<{ name: string, value: string}>, name: string, defaultValue?: string) {
  const header = headers.filter(h => new RegExp(`^${name}$`, 'i').test(h.name))[0];
  if (header) {
    return header.value;
  }
  return defaultValue;
}

function getUri(uri: string, headers: Array<{ name: string, value: string}>) {
  if (/^https?:\/\//g.test(uri)) {
    return uri;
  }
  const host = getHeaderValue(headers, 'host');
  if (host) {
    return `https://${host}${uri}`;
  }
  return uri;
}

const database = (async () => {
  const client = await mongodb.MongoClient.connect(config.MONGODB_SEVER);
  const db = client.db(config.MONGODB_DATABASE);

  return db;
})();

async function getMessagesHandler(req: restify.Request, res: restify.Response, next: restify.Next) {
  const db = await database;
  const messages = (
    await db.collection('messages')
      .find({})
      .project({
        '_id': 1,
        'request.timestamp': 1,
        'request.method': 1,
        'request.uri': 1,
        'request.headers': 1,
        'response.statuscode': 1,
      })
      .toArray()
    ).map(r => ({
      id: r._id,
      timestamp: r.request.timestamp,
      method: r.request.method,
      uri: getUri(r.request.uri, r.request.headers),
      statuscode: (r.response || {}).statuscode,
    }));

  res.json(messages);
  next();
}

async function getMessageDetailsHandler(req: restify.Request, res: restify.Response, next: restify.Next) {
  const db = await database;
  const message = (await db.collection('messages')
    .find({
      _id: req.params.id,
    })
    .toArray())
    .map(r => ({
      id: r._id,
      request: decodeBody(r.request),
      response: decodeBody(r.response),
    }))[0];

  if (!message) {
    res.status(404);
  } else {
    res.json(message);
  }

  next();
}

function decodeBody(payload: any) {
  if (payload) {
    return Object.assign({}, payload, { body: payload.body.toString('utf8'), body64: payload.body.toString('base64') });
  }
  return payload;
}

export function register(server: restify.Server) {
  server.get('/messages', getMessagesHandler);
  server.get('/messages/:id', getMessageDetailsHandler);
}

export default {
  register,
};
