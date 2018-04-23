import './Header.scss';

import * as React from 'react';

interface Props {
  onSelect?: (tool: string) => void;
}

class Header extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleSettings = this.handleSettings.bind(this);
  }

  private handleSettings() {
    if (this.props.onSelect) {
      this.props.onSelect('settings');
    }
  }

  public render() {
    return (
      <div className="Header">
        <div className="brand">GoFiddle</div>
        <div className="tools">
          <button onClick={this.handleSettings}>Settings</button>
        </div>
      </div>
    );
  }
}

export default Header;
