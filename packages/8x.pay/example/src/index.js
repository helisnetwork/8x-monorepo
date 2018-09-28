import React from 'react';
import ReactDOM from 'react-dom';

// main app
import EightExPay from '../../src/';

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById('8x.pay');
  let planHash;

  if (element.hasAttributes()) {
    var attrs = element.attributes;
    for (var i = attrs.length - 1; i >= 0; i--) {
      if (attrs[i].name == 'planhash') {
        planHash = attrs[i].value;
      }
    }
  }

  console.log('Plan hash is ' + planHash);
  ReactDOM.render(
    <EightExPay
      planHash={planHash}
      activated={(subscriptionHash, status) => {
        console.log(subscriptionHash + ' ' + status);
      }}/>
    , element);
});
