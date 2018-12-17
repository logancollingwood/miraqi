import React  from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileMain from "./components/ProfileMain";

class Profile extends React.Component {

    render() {
        return (
            <div> 
                <div className="row justify-content-md-center profile-content">
                    <div className="col-3 profile-sidebar">
                        <ProfileSidebar />
                    </div>
                    <div className="col-8 offset-md-1 profile-main">
                        <ProfileMain />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;