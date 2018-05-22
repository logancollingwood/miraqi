import React  from "react";

class Profile extends React.Component {

    render() {
        return (
            <div> 
                <div className="row justify-content-md-center profile-content">
                    <div className="col-2 col-md-offset-2">
                        <i className="fas fa-arrow-left fa-2x bounce"></i>
                    </div>
                    <div className="col-8 col-md-offset-2">
                    <h1 className="banner"> Join one of your discord servers </h1>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Profile;