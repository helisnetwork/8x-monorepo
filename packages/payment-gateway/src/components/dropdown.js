/* Import statements */
import React from 'react';
import DropdownButton from './dropdown-button.js';

/* App component */
class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showMenu: false,
      items: this.props.items,
      selectedItem: this.props.items[0]
    };
    
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.itemSelected = this.itemSelected.bind(this);
  }
  
  showMenu(event) {    
    this.setState({ 
      showMenu: true 
    }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu(event) {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({
        showMenu: false 
      }, () => {
        document.removeEventListener('click', this.closeMenu);
      });  
    }
  }

  itemSelected(object) {
    this.setState({
      selectedItem: object, 
      showMenu: false 
    }, () => {
      document.removeEventListener('click', this.closeMenu);
    }); 
  }
  
  render() {
    return (
      <div className="dropdown-wrapper">
        <div className="dropdown-container">
          <DropdownButton item={this.state.selectedItem} action={this.showMenu} showTriangle={true} />
          {
            this.state.showMenu
              ? (
                <div
                  className="menu"
                  ref={(element) => {
                    this.dropdownMenu = element;
                  }}>
                  {this.returnDropdownButtons()}
                </div>
              ): null
          } 
        </div>
      </div>
    );
  }

  returnDropdownButtons(items) { 
    return this.props.items.filter((object) => {
      return this.state.selectedItem.name !== object.name;
    }).map((object, i) => {
      return <DropdownButton item={object} key={i} action={this.itemSelected} showTriangle={false}/>;
    });
  }
};

export default Dropdown;
