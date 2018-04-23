import * as fetch from 'isomorphic-fetch';
import * as React from 'react';
import config from '../config';
import replace from '../util/replace';

const certificateUrl = `${config.restApi}certificate`;

class CertificatesPanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasCertificate: false,
      ready: false,
    };
  }

  public async componentDidMount() {
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

  public render() {
    let content: string = require(this.state.hasCertificate ? './certificate-installed.md' : './certificate-not-installed.md');
    content = replace(content, { certificateUrl });
    return (
      <div style={{ display: this.state.ready ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: content }} />
    );
  }
}

export default CertificatesPanel;
