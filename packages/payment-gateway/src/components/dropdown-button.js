/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

class DropdownButton extends React.Component {
  render() {
    return (
      <div>
        <button className="button" onClick={this.props.action}>
          <div className="label">
            <div className="left">
              <img className="logo" src={this.props.image}/>
              <p className="coin-name">{this.props.item.name}</p>
            </div>
            <div className="right">
              <p className="coin-ticker">{this.props.ticker}</p>
              {this.props.showTriangle ? <p className="triangle">{this.props.triangle}</p> : null}
            </div>
          </div>
        </button>
      </div>
	  );
  }
}

export default DropdownButton;