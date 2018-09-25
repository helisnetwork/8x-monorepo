/* Import statements */
import React from 'react';
import { Link } from 'react-router-dom';
import bus from '../bus';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <Link className="back button" to={this.props.previousPage}>
          Back
        </Link>
        <p className="heading-label">{this.props.title}</p>
        <a className="close button" onClick={() => bus.trigger('modal:show', false)}>Close</a>
      </div>
    );
  }
}

export default Header;