import React from 'react';

import { ReceptionistView } from './Receptionist';
import { DoctorView } from './Doctor';
import { AdminView } from './Admin';

import { verifyJWT } from '../../common';
import {
    RoleConstants,
    AccessTokenKey,
} from '../../constants';

const Dashboard = () => {
    const token = localStorage.getItem(AccessTokenKey);

    return (
        <React.Fragment>
            {verifyJWT(token, RoleConstants.AdministratorRoleName) && <AdminView />}
            {verifyJWT(token, RoleConstants.DoctorRoleName) && <DoctorView />}
            {verifyJWT(token, RoleConstants.ReceptionistRoleName) && <ReceptionistView />}
        </React.Fragment>
    );
}

export default Dashboard;
