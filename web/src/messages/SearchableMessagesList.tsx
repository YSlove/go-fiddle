import * as React from 'react';
import { MessageSummary } from '../models/Message';
import SearchContext from '../search/SearchContext';
import regex from '../util/regex';
import MessagesList, { Props as MessagesListProps} from './MessagesList';

function expressionFilter(message: MessageSummary, expression: string) {
  if (!expression) { return true; }
  const exp = new RegExp(regex.escape`${expression}`, 'i');

  return exp.test(message.uri) || exp.test(message.method) || exp.test(message.statuscode);
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
