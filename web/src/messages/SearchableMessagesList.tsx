import * as React from 'react';
import { MessageSummary } from '../models/Message';
import SearchContext from '../search/SearchContext';
import regex from '../util/regex';
import MessagesList, { Props as MessagesListProps} from './MessagesList';

const typeEvaluator = {
  '*': (message: MessageSummary) => `${message.method} ${message.uri} ${(message.statuscode || '').toString()}`,
  'host': (message: MessageSummary) => {
    const match = /https?:\/\/([^/]+)/i.exec(message.uri);
    if (match) {
      return match[1];
    }
    return '';
  },
  'method': (message: MessageSummary) => message.method,
  'status': (message: MessageSummary) => (message.statuscode || '').toString(),
  'uri': (message: MessageSummary) => message.uri,
};

function expressionFilter(message: MessageSummary, expressionString: string) {
  if (!expressionString) { return true; }
  const expressions = expressionString.split(' ').filter(s => s);

  let isMatch = true;
  for (const expression of expressions) {
    const match = /^(([^:]*):)?(.*)/.exec(expression);

    if (match) {
      let [ , , type, value ] = match;

      // ignore
      if (/^https?:/i.test(expression)) {
        type = '';
        value = expression;
      }

      if (!value) { continue; }

      const exp = new RegExp(regex.escapeWildcard`${value}`, 'i');

      const evaluator = typeEvaluator[type || '*'];
      if (evaluator) {
        if (!exp.test(evaluator(message))) {
          isMatch = false;
          break;
        }
      }
    }
  }
  return isMatch;
}

class SearchableMessagesList extends React.Component<MessagesListProps> {
  public render() {
    return (
      <SearchContext.Consumer>
        {({expression}) => (
          <MessagesList {...this.props} messages={this.props.messages.filter(m => expressionFilter(m, expression))} />
        )}
      </SearchContext.Consumer>
    );
  }
}

export default SearchableMessagesList;
