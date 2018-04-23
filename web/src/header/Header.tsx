import './Header.scss';

import * as React from 'react';

interface Props {
  search: string;
  onSelect?: (tool: string) => void;
  onSearch?: (search: string) => void;
}

class Header extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    search: '',
  }

  constructor(props: Props) {
    super(props);

    this.handleSettings = this.handleSettings.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  private handleSettings() {
    if (this.props.onSelect) {
      this.props.onSelect('settings');
    }
  }

  private handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.onSearch) {
      this.props.onSearch(e.target.value);
    }
  }

  public render() {
    return (
      <div className="Header">
        <div className="brand">GoFiddle</div>
        <div className="search">
          <input type="text" placeholder="Search" name="search" id="search" onChange={this.handleSearchChange} />
        </div>
        <div className="tools">
          <button onClick={this.handleSettings}>Settings</button>
        </div>
      </div>
    );
  }
}

export default Header;
