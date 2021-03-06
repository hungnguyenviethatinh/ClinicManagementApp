import React from 'react';
import { Redirect } from 'react-router-dom';

import Layout from '../../layout';

import { verifyJWT } from '../../common';
import {
    RouteConstants,
    AccessTokenKey,
} from '../../constants';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    const token = localStorage.getItem(AccessTokenKey);
    const isAuthenticated = verifyJWT(token);

    return (
        <Layout {...rest} component={matchProps => (
            isAuthenticated ? <Component {...matchProps} /> : <Redirect to={{
                pathname: RouteConstants.LoginView,
                state: { from: matchProps.location }
            }} />
        )} />
    );
}

export default PrivateRoute;
