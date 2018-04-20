import './Settings.css';

import React, { Component } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CertificatesPanel from './CertificatesPanel';
import CloseButton from '../common/CloseButton';

class SettingsPanel extends Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <div className="SettingsPanel">
        <CloseButton className="close" onClick={this.handleClose} />
        <h1>Settings</h1>
        <Tabs>
          <TabList>
            <Tab>Certificates</Tab>
            <Tab>Proxy Configuration</Tab>
            <Tab>Sessions</Tab>
          </TabList>

          <TabPanel>
            <CertificatesPanel />
          </TabPanel>
          <TabPanel>
          </TabPanel>
          <TabPanel>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default SettingsPanel;
