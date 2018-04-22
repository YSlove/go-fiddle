import './StatusPanel.css';

import * as React from 'react';
import CloseButton from './CloseButton';

interface Props {
  onDismiss?: () => void;
  type: string;
}

class StatusPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
  }

  private handleHide() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  public render() {
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
