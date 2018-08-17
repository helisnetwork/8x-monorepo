/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';
import DropdownButton from './dropdown-button.js';

/* App component */

class Dropdown extends React.Component {
  constructor() {
    super();
    
    this.state = {
      showMenu: false,
    };
    
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }
  
  showMenu(event) {
    event.preventDefault();
    
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu(event) {
    
    if (!this.dropdownMenu.contains(event.target)) {
      
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });  
      
    }
  }

  render() {
    return (
      <div className="dropdown-container">
        <button className="button" onClick={this.showMenu}>
          <div className="label">
            <div className="left">
              <img className="logo" src={this.props.images}/>
              <p className="coin-name">{this.props.name}</p>
            </div>
            <div className="right">
              <p className="coin-ticker">{this.props.ticker}</p>
              <p className="triangle">{this.props.triangle}</p>
            </div>
          </div>
        </button>
        
        {
          this.state.showMenu
            ? (
              <div
                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
                <DropdownButton/>
                <DropdownButton/>
                <DropdownButton/>
                
              </div>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}

export default Dropdown;
