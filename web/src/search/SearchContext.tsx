import * as React from 'react';

interface Search {
  expression: string;
}

const context = React.createContext<Search>({ expression: '' });

export default context;
