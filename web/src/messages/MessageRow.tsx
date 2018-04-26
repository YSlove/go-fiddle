import './Messages.scss';

import * as moment from 'moment';
import * as React from 'react';
import { MessageSummary } from '../models/Message';
import HighlightableText from '../search/HighlightableText';
import SearchContext from '../search/SearchContext';

function getExpressionByType(expressionString: string, ...expressionTypes: string[]) {
  const filteredExpressions: string[] = [];
  const expressions = expressionString.split(' ').filter(s => s);
  for (const expression of expressions) {
    const match = /^(([^:]*):)?(.*)/.exec(expression);

    if (match) {
      let [ , , type, value ] = match;

      // ignore
      if (/^https?:/i.test(expression)) {
        type = '';
        value = expression;
      }

      for (const expressionType of expressionTypes) {
        if ((!type || type === expressionType) && value) {
          filteredExpressions.push(value);
        }
      }
    }
  }
  return filteredExpressions;
}

function getParent(element: HTMLElement, selector?: string): HTMLElement | null {
  const parent = element.parentElement;

  if (selector && parent) {
    let matches = false;
    if (parent.matches) {
      matches = parent.matches(selector);
    } else if (parent.msMatchesSelector) {
      matches = parent.msMatchesSelector(selector);
    }

    if (matches) {
      return parent;
    } else {
      return getParent(parent, selector);
    }
  }

  return parent;
}

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

  private scrollIntoView() {
    if (this.props.active && this.rowElement && this.rowElement.scrollIntoView) {
      const elem: HTMLElement = this.rowElement;
      const parent = getParent(elem, 'div.list-panel');
      if (parent) {
        if (elem.offsetTop > parent.scrollTop + parent.clientHeight) {
          elem.scrollIntoView(false);
        } else if (elem.offsetTop < parent.scrollTop) {
          parent.scrollTo(0, elem.offsetTop);
        }
      }
    }
  }

  public componentDidMount() {
    this.scrollIntoView();
  }

  public componentDidUpdate() {
    this.scrollIntoView();
  }

  public render() {
    const { message, active } = this.props;
    const { timestamp, method, uri, statuscode } = message;

    return (
      <SearchContext.Consumer>
        {({expression}) => (
          <tr ref={(e) => this.rowElement = e} tabIndex={0} className={active ? 'active' : ''} onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
            <td className="col-time">{moment(timestamp / 1000000).format('HH:mm:ss')}</td>
            <td className="col-method"><HighlightableText text={method} expressions={getExpressionByType(expression, 'method')} /></td>
            <td className="col-uri" title={uri}><HighlightableText text={uri} expressions={getExpressionByType(expression, 'uri', 'host')} /></td>
            <td className="col-status"><HighlightableText text={(statuscode || '-').toString()} expressions={getExpressionByType(expression, 'status')} /></td>
          </tr>
        )}
      </SearchContext.Consumer>
    );
  }
}

export default MessagesRow;
