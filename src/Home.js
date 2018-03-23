import React from 'react';
import Nav from "./Nav";

export default React.createClass({
  render() {
    return (
      <div>
        <Nav isHome={true}/>
        <div className="container-fluid home">
          <div className="content">
            <div className="row justify-content-md-center">
              <div className="col-8">
                <h1 className="name"> eden </h1>
              </div>
            </div>
            <div className="row justify-content-md-center jobs">
              <div className="col-8">
                <h2 className="title"> get a room </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
})