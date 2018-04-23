import './Messages.scss';

import * as moment from 'moment';
import * as React from 'react';
import { MessageSummary } from '../models/Message';
import HighlightableText from '../search/HighlightableText';
import SearchContext from '../search/SearchContext';

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

  // public componentDidMount() {
  //   if (this.props.active) {
  //     this.rowElement.focus();
  //   }
  // }

  // public componentDidUpdate() {
  //   if (this.props.active) {
  //     this.rowElement.focus();
  //   }
  // }

  public render() {
    const { message, active } = this.props;
    const { timestamp, method, uri, statuscode } = message;

    return (
      <SearchContext.Consumer>
        {({expression}) => (
          <tr ref={(e) => this.rowElement = e} tabIndex={0} className={active ? 'active' : ''} onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
            <td className="col-time">{moment(timestamp / 1000000).format('HH:mm:ss')}</td>
            <td className="col-method"><HighlightableText text={method} expression={expression} /></td>
            <td className="col-uri" title={uri}><HighlightableText text={uri} expression={expression} /></td>
            <td className="col-status"><HighlightableText text={(statuscode || '-').toString()} expression={expression} /></td>
          </tr>
        )}
      </SearchContext.Consumer>
    );
  }
}

export default MessagesRow;
