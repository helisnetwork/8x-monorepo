import React from 'react';
import ReactDOM from 'react-dom';

// main app
import App from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById('app');
  let planHash;

  if (element.hasAttributes()) {
    var attrs = element.attributes;
    for (var i = attrs.length - 1; i >= 0; i--) {
      console.log(console.log(attrs[i].name));
      if (attrs[i].name == 'planhash') {
        console.log('found!');
        planHash = attrs[i].value;
      }
    }
  }
  console.log('Plan hash is ' + planHash);
  ReactDOM.render(<App planHash={planHash}/>, element);
});