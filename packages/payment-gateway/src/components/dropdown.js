/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';
import DropdownButton from './dropdown-button.js';

/* App component */

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.selectedItem = this.props.items[0];
    
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

  returnDropdownButtons(items) {
    let selectedItem = this.selectedItem;
    return this.props.items.map(function(object, i) {
      return selectedItem !== object ? <DropdownButton item={object} key={i} /> : null;
    });
  }

  render() {
    return (
      <div className="dropdown-container">
        <DropdownButton item={this.selectedItem} action={this.showMenu}/>
        
        {
          this.state.showMenu
            ? (
              <tbody
                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}>
                {this.returnDropdownButtons()}
              </tbody>
            ): null
        }
      </div>
    );
  }
}

export default Dropdown;
