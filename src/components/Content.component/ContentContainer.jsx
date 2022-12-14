import React from "react";
import contentStyles from "./Content.module.css";
import Content from "./Content";
import {connect} from "react-redux";
import {getUserStatus, setProfile, updateUserStatus} from "../../redux/reducers/profile-reducer";
import {useLocation, useNavigate, useParams} from "react-router";
import {Navigate} from "react-router-dom";
import {withAuthRedirectComponent} from "../../hoc/AuthRedirect";
import {compose} from "redux";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{location, navigate, params}}
            />
        );
    };

    return ComponentWithRouterProp;
}

class ContentContainer extends React.Component {
    componentDidMount() {
        let userId = this.props.router.params.userId;

        if (!userId) userId = this.props.userId ? this.props.userId : 27210;

        this.props.setProfile(userId);
        this.props.getUserStatus(userId);
    };

    render() {
        if (!this.props.isAuth) {
            return <Navigate to={'/login'}/>
        }
        ;
        return (
            <div className={contentStyles.content}>
                <Content {...this.props} profile={this.props.profile} status={this.props.status}
                         updateUserStatus={this.props.updateUserStatus}></Content>
            </div>
        );
    };
};

let MapStateToProps = (state) => ({
    profile: state.profilePage.profile,
    status: state.profilePage.status,
    authorizedUserId: state.auth.userId,
    isAuth: state.auth.isAuth
});
export default compose(
    connect(MapStateToProps, {setProfile, getUserStatus, updateUserStatus}),
    withRouter,
    withAuthRedirectComponent
)(ContentContainer)