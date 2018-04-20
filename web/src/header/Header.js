import './Header.css';
import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCertificatesPanel: false,
    };

    this.handleSettings = this.handleSettings.bind(this);
  }

  handleSettings() {
    if (this.props.onSelect) {
      this.props.onSelect('settings');
    }
  }

  render() {
    return (
      <div className="Header">
        <div className="brand">GoFiddle</div>
        <div className="tools">
          <button onClick={this.handleSettings}>Settings</button>
          {/* <a href={`${config.restApi}certificate`}>Download certificate</a> */}
        </div>
      </div>
    );
  }
}

export default Header;
