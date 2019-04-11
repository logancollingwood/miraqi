import React  from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileMain from "./ProfileMain";
import Style from "./style/Profile.module.scss";

class Profile extends React.Component {

    render() {
        return (
            <div> 
                <div className={"row justify-content-md-center profile-content " + Style.profile_content} >
                    <div className={"col-3 " + Style.profile_sidebar}>
                        <ProfileSidebar />
                    </div>
                    <div className={"col-8 offset-md-1 " + Style.profile_main}>
                        <ProfileMain />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;