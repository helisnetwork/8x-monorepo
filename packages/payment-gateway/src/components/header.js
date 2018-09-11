/* Import statements */
import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <Link className="back button" to={this.props.previousPage}>
          Back
        </Link>
        <p className="heading-label">{this.props.title}</p>
        <p className="close button" onClick={this.props.onCloseRequest}>Close</p>
      </div>
    );
  }
}

export default Header;