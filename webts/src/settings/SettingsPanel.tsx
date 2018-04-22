import './Settings.scss';

import * as React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CloseButton from '../common/CloseButton';
import CertificatesPanel from './CertificatesPanel';

interface Props {
  onClose: () => void;
}

class SettingsPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  private handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  public render() {
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
            <div />
          </TabPanel>
          <TabPanel>
            <div />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default SettingsPanel;
