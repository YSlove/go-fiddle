import './CloseButton.css';

import React, { Component } from 'react';

class CloseButton extends Component {
  render() {
    return (
      <button title="Close" {...this.props} className={['CloseButton', this.props.className].filter(c => c).join(' ')}>
        <svg width={20} height={20}>
          <path className="path" fill="none" strokeWidth={2} d="M4,4 L16,16 M4,16 L16,4" />
        </svg>
      </button>
    );
  }
}

export default CloseButton;
