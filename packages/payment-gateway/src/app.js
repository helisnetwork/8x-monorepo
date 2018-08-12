/* Import statements */
import React from 'react';

/* Import pages */
import PersonalWalletExplain from './pages/personal-wallet-explain';

import './assets/stylesheets/app.scss';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <PersonalWalletExplain/>
      </div>
    );
  }
};

export default App;
