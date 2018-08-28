/* Import statements */
import React from 'react';

import './assets/stylesheets/app.scss';
import SelectWallet from './pages/select-wallet';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <SelectWallet/>
      </div>
    );
  }
};

export default App;
