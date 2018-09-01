/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

class DropdownButton extends React.Component {
  render() {
    return (
      <div className="container">
        <button className="dropdown" onClick={() => this.props.action(this.props.item)}>
          <div className="label">
            <div className="left">
              <img className="logo" src={this.props.item.image}/>
              <p className="coin-name">{this.props.item.name}</p>
            </div>
            <div className="right">
              <p className="coin-ticker">{this.props.item.ticker}</p>
              {this.props.showTriangle
                ? <p className="triangle"/>
                : <p/>
              }
            </div>
          </div>
        </button>
      </div>
	  );
  }
}

export default DropdownButton;