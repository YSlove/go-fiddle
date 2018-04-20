import './StatusPanel.css';

import React, { Component } from 'react';
import CloseButton from './CloseButton';

class StatusPanel extends Component {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
  }

  handleHide() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  render() {
    const { type } = this.props;
    return (
      <div className={['StatusPanel', type].join(' ')}>
        <CloseButton className="close" onClick={this.handleHide} />
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default StatusPanel;
