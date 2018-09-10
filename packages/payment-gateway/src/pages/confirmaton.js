import React from 'react'; 
import Header from '../components/header';

export default class Confirmation extends React.Component {
  
  constructor(){
    super();

  }

  render(){
    return (
      <div className="background">
        <div className="small-card">
          <Header title="Successful" previousPage="/"/>
          <p>Hello</p>
        </div>
      </div>
    );
  };
}