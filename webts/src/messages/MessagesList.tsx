import './Messages.css';

import * as React from 'react';
import { MessageSummary } from '../models/Message';
import MessageRow from './MessageRow';

interface Props {
  activeMessageId?: string;
  messages: MessageSummary[];
  onSelect?: (message: MessageSummary) => void;
}

class MessagesList extends React.Component<Props> {
  private containerElement: any;
  private headerElement: any;
  private rowsElement: any;

  constructor(props: Props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  private handleSelect(message: MessageSummary) {
    if (this.props.onSelect) {
      this.props.onSelect(message);
    }
  }

  private handleKeyDown(e: React.KeyboardEvent<any>) {
    const { activeMessageId, messages } = this.props;

    if (!messages || !messages.length) { return };
    if (['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].indexOf(e.key) === -1) { return };

    const height = this.rowsElement.clientHeight - this.headerElement.clientHeight;
    const rowHeight = height / messages.length;
    const pageSize = Math.floor((this.containerElement.parentElement.clientHeight - this.headerElement.clientHeight) / rowHeight);

    console.log('pageSize', pageSize, 'header', this.refs.header, this.headerElement.clientHeight, 'rows', this.refs.rows, this.rowsElement.clientHeight);

    const selectedIndex = messages.findIndex(m => m.id === activeMessageId);
    let newIndex = selectedIndex;

    if (e.key === 'ArrowUp') {
      newIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'ArrowDown') {
      newIndex = Math.min(selectedIndex + 1, messages.length - 1);
    } else if (e.key === 'PageUp') {
      newIndex = Math.max(selectedIndex - pageSize, 0);
    } else if (e.key === 'PageDown') {
      newIndex = Math.min(selectedIndex + pageSize, messages.length - 1);
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = messages.length - 1;
    }

    e.preventDefault();
    e.stopPropagation();

    const message = messages[newIndex];
    this.handleSelect(message);

    console.log('Key down', e, e.keyCode, e.key);
  }

  public render() {
    const { activeMessageId } = this.props;

    return (
      <div ref={(e) => this.containerElement = e} className="MessageList">
        <table ref={(e) => this.headerElement = e} className="head" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="col-time">Time</th>
              <th className="col-method">Method</th>
              <th className="col-uri">Uri</th>
              <th className="col-status">Status</th>
            </tr>
          </thead>
        </table>
        <table ref={(e) => this.rowsElement = e} className="body" cellSpacing="0" cellPadding="0" onKeyDown={this.handleKeyDown}>
          <tbody>
            {this.props.messages.map(m => (
              <MessageRow key={m.id}
                message={m}
                active={m.id === activeMessageId}
                onClick={this.handleSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MessagesList;
