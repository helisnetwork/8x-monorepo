/* Import statements */
import React from 'react';

/* Import pages */
import SelectWallet from './pages/select-wallet';

import './assets/stylesheets/app.scss';

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
