import React, {Component} from 'react';
import Nav from "../components/nav/Nav";

export default class PageNotFound extends Component {

    render() {
        return (
            <div>
                <Nav isHome={true} loading={false}/>
                <div className="container-fluid home">
                    <div className="content">
                        <div className="row justify-content-md-center">
                        <div className="col-8">
                            <h1 className="homeName"> Whoops, how'd you get here? </h1>
                        </div>
                        </div>
                        <div className="row justify-content-md-center go">
                            <button> <a href="/"> <p> take me home </p></a></button>
                        </div>
                    </div>
                </div>
            </div>
        )
        
    }


}