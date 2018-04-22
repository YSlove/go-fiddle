import './Messages.css';

import * as moment from 'moment';
import * as React from 'react';
import { MessageSummary } from '../models/Message';

interface Props {
  active: boolean;
  message: MessageSummary;
  onClick?: (meassage: MessageSummary) => void
}

class MessagesRow extends React.Component<Props> {
  private rowElement: any;

  constructor(props: Props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  private handleClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.message);
    }
  }

  private handleKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Tab') { return };

    if (e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      this.handleClick();
    }
  }

  public componentDidMount() {
    if (this.props.active) {
      this.rowElement.focus();
    }
  }

  public componentDidUpdate() {
    if (this.props.active) {
      this.rowElement.focus();
    }
  }

  public render() {
    const { message, active } = this.props;
    const { timestamp, method, uri, statuscode } = message;

    return (
      <tr ref={(e) => this.rowElement = e} tabIndex={0} className={active ? 'active' : ''} onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
        <td className="col-time">{moment(timestamp / 1000000).format('HH:mm:ss')}</td>
        <td className="col-method">{method}</td>
        <td className="col-uri" title={uri}>{uri}</td>
        <td className="col-status">{statuscode || '-'}</td>
      </tr>
    );
  }
}

export default MessagesRow;
