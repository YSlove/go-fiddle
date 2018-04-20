import React, { Component } from 'react';
import config from '../config';
import fetch from 'isomorphic-fetch';

const certificateUrl = `${config.restApi}certificate`;

class CertificatesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      hasCertificate: false,
    };
  }

  async componentWillMount() {
    try {
      const resp = await fetch(certificateUrl);
      if (resp.status === 200) {
        this.setState({ hasCertificate: true, ready: true });
      } else {
        this.setState({ hasCertificate: false, ready: true });
      }
    } catch (err) {
      this.setState({ hasCertificate: false, ready: true });
    }
  }

  render() {
    return (
      <div style={{ display: this.state.ready ? 'block' : 'none' }}>
        <h2>Certificate Details</h2>
        { this.state.hasCertificate ?
          <div>
            <p>Certificates are configured and can be <a href={certificateUrl}>downloaded</a> and installed.</p>
            <h3>Installation Instructions</h3>
            <p>Install certificates by... TODO</p>
          </div> :
          <p>Certificates are not currently configured and https requests will not be captured.</p>
        }
      </div>
    );
  }
}

export default CertificatesPanel;
