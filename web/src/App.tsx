import './App.scss';

import * as fetch from 'isomorphic-fetch';
import * as React from 'react';
import Sockette from 'sockette';
import StatusPanel from './common/StatusPanel';
import config from './config';
import Header from './header/Header';
import MessageDetails from './messages/MessageDetails';
import SearchableMessageList from './messages/SearchableMessagesList';
import * as models from './models/Message';
import SearchContext from './search/SearchContext';
import SettingsPanel from './settings/SettingsPanel';

interface State {
  messages: models.MessageSummary[];
  selectedMessage?: models.MessageDetails;
  selectedMessageId?: string;
  showSettings: boolean;
  status?: {
    message: string,
    type: string,
  };
  search: string;
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      messages: [],
      search: '',
      showSettings: false,
    };

    this.handleMessageSelect = this.handleMessageSelect.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusClose = this.handleStatusClose.bind(this);
    this.handleHeader = this.handleHeader.bind(this);
    this.handleSettingsClose = this.handleSettingsClose.bind(this);
  }

  public componentDidMount() {
    // tslint:disable-next-line:no-unused-expression
    new Sockette(config.websocket, {
      maxAttempts: 10,
      onmessage: (e: any) => {
        this.handleData(e);
      },
      timeout: 5000,
    });

    return this.refreshData();
  }

  private async refreshData() {
    const response = await fetch(`${config.restApi}messages`);
    const messages = await response.json();

    this.setState({messages});
  }

  private handleError(err: Error) {
    console.error(err);
    this.setState({
      status: {
        message: 'Oops, something went wrong',
        type: 'error',
      },
    });
  }

  private handleSearch(search: string) {
    this.setState({ search });
  }

  private handleStatusClose() {
    this.setState({
      status: undefined,
    });
  }

  private async handleMessageSelect(message: models.MessageSummary) {
    this.setState({
      selectedMessage: undefined,
      selectedMessageId: message.id,
    });

    try {
      const response = await fetch(`${config.restApi}messages/${message.id}`);
      const messageDetails = await response.json();

      this.setState({
        selectedMessage: messageDetails,
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleMessageDelete(message: models.MessageSummary) {
    const messages = this.state.messages.slice();
    const index = messages.findIndex(m => m.id === message.id);
    if (index !== -1) {
      messages.splice(index, 1);
    }
    this.setState({ messages });
  }

  private handleData(e: any) {
    const data = JSON.parse(e.data);
    const messages = this.state.messages.slice();
    const index = messages.findIndex(m => m.id === data.id);

    if (index === -1) {
      messages.push(data);
    } else {
      messages[index] = data;
    }

    this.setState({messages});
  }

  private handleHeader(tool: string) {
    if (tool === 'settings') {
      this.setState({ showSettings: true });
    }
  }

  private handleSettingsClose() {
    this.setState({ showSettings: false });
  }

  public render() {
    return (
      <SearchContext.Provider value={{ expression: this.state.search }}>
        <div className="App">
          <Header search={this.state.search} onSelect={this.handleHeader} onSearch={this.handleSearch} />
          <div className="container">
            <div className="list-panel">
              <SearchableMessageList
                messages={this.state.messages}
                activeMessageId={this.state.selectedMessageId}
                onSelect={this.handleMessageSelect}
                onDelete={this.handleMessageDelete}
              />
            </div>
            <div className="details-panel">
              <MessageDetails message={this.state.selectedMessage} />
            </div>
          </div>
          { this.state.showSettings ?
            <SettingsPanel onClose={this.handleSettingsClose} /> :
            null
          }
          { this.state.status ?
            <StatusPanel type={this.state.status.type} onDismiss={this.handleStatusClose}>{this.state.status.message}</StatusPanel> :
            null
          }
        </div>
      </SearchContext.Provider>
    );
  }
}

export default App;
