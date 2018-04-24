import fetch from 'isomorphic-fetch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

describe('App.tsx', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App fetch={fetch} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
