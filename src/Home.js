import React from 'react';
import Nav from "./Nav";

export default React.createClass({
  render() {
    return (
      <div>
        <Nav isHome={true}/>
        <div className="container-fluid h-100 main-content">
          <div className="row" id="home">
          </div>
        </div>
      </div>

    )
  }
})