import * as React from 'react';
import regex from '../util/regex';

interface Props {
  text: string;
  expression: string;
}

function getHighlights(text: string, expression: string) {
  let i = 0;
  if (!expression) { return <span key={++i}>{text}</span>; }

  const matchExpression = new RegExp(regex.escape`${expression}`, 'gi');

  const components: JSX.Element[] = [];
  let currentIndex = 0;

  while (true) {
    const match = matchExpression.exec(text);
    if (!match) {
      if (currentIndex !== text.length) {
        components.push(<span key={++i}>{text.substring(currentIndex, text.length)}</span>);
      }
      break;
    }

    components.push(<span key={++i}>{text.substring(currentIndex, match.index)}</span>);
    components.push(<span key={++i} className="highlight">{match[0]}</span>);
    currentIndex = match.index + match[0].length;
  }

  return components;
}

class HighlightableText extends React.Component<Props> {
  public render() {
    const { text, expression } = this.props;

    const highlights = getHighlights(text, expression);

    return (
      <span>{highlights}</span>
    );
  }
}

export default HighlightableText;
