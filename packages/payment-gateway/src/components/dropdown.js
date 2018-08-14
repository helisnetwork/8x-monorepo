/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';

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
          <div className="dropdown">
            <div className="label">
              <img src={Images.ethLogo}/>
              <p>Ethereum</p>
              <p>ETH</p>
              <p className="triangle"></p>
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
                <button> Menu item 1 </button>
                <button> Menu item 2 </button>
                <button> Menu item 3 </button>
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
