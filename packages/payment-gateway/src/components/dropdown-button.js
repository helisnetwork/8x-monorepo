/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

class DropdownButton extends React.Component {
  render() {
    return (
      <div className="container">
        <button className="button" onClick={() => {
          return this.props.action();
        }}>
          <div className="label">
            <div className="left">
              <img className="logo" src={this.props.item.image}/>
              <p className="coin-name">{this.props.item.name}</p>
            </div>
            <div className="right">
              <p className="coin-ticker">{this.props.item.ticker}</p>
              <p className="triangle" style={this.props.showTriangle ? null : {'visibility': 'none'}}>{this.props.triangle}</p>
            </div>
          </div>
        </button>
      </div>
	  );
  }
}

export default DropdownButton;