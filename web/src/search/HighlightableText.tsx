import * as React from 'react';
import * as range from '../util/range';
import regex from '../util/regex';

interface Props {
  text: string;
  expressions: string[];
}

function getHighlights(text: string, expressions: string[]) {
  let i = 0;
  if (!expressions.length) { return <span key={++i}>{text}</span>; }

  let matches: range.Range[] = [];
  for (const expression of expressions) {
    const matchExpression = new RegExp(regex.escapeWildcard`${expression}`, 'gi');

    while (true) {
      const match = matchExpression.exec(text);
      if (match) {
        matches.push({ start: match.index, end: match.index + match[0].length});
      } else {
        break;
      }
    }
  }

  matches = range.mergeRanges(matches);

  const elements: JSX.Element[] = [];

  let currentIndex = 0;
  for (const match of matches) {
    elements.push(<span key={++i}>{text.substring(currentIndex, match.start)}</span>);
    elements.push(<span key={++i} className="highlight">{text.substring(match.start, match.end)}</span>);
    currentIndex = match.end;
  }

  if (currentIndex < text.length) {
    elements.push(<span key={++i}>{text.substring(currentIndex, text.length)}</span>);
  }

  return elements;
}

class HighlightableText extends React.Component<Props> {
  public render() {
    const { text, expressions } = this.props;

    const highlights = getHighlights(text, expressions);

    return (
      <span>{highlights}</span>
    );
  }
}

export default HighlightableText;
