/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

class DropdownButton extends React.Component {
  render() {
    return (
      <div>
        <button className="button">
          <div className="label">
            <div className="left">
              <img className="logo" src={this.props.images}/>
              <p className="coin-name">{this.props.name}</p>
            </div>
            <div className="right">
              <p className="coin-ticker">{this.props.ticker}</p>
            </div>
          </div>
        </button>
      </div>
	  );
  }
}

export default DropdownButton;