import React from 'react';
import ReactDOM from 'react-dom';

// main app
import App from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App/>, document.getElementById('app'));
});