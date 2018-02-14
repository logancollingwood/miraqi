import React from 'react';
import Nav from "./Nav";

export default React.createClass({
  render() {
    return (
      <div>
        <Nav isHome={true}/>
        <div className="container-fluid">
          <div className="row">
            content babYee
          </div>
        </div>
      </div>

    )
  }
})