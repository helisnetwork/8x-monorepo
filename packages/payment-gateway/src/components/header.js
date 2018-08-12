/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

class Header extends React.Component {
  render() {
    return (
		  <div className="header">
			  <p className="back button">Back</p>
        <p className="heading-label">{this.props.title}</p>
			  <p className="close button">Close</p>
		  </div>
	  );
  }
}

export default Header;