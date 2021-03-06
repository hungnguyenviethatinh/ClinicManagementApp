import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { Dashboard as DashboardView } from './views/Dashboard';
import { Login as LoginView } from './views/Login';
import { PatientsView, PatientDetailView } from './views/Patients';
import { PatientManagementView } from './views/PatientManagement';
import { PrescriptionsView, PrescriptionDetailView } from './views/Prescriptions';
import { PrescriptionManagementView } from './views/PrescriptionManagement';
import {
    ServiceFormView, CtFormView, MriFormView, TestFormView, XqFormView,
} from './views/ServiceForm';
import { UserManagementView } from './views/UserManagement';
import { DrugManagementView } from './views/DrugManagement';
import { DataInputManagementView } from './views/DataInputManagement';
import { OpenTimeManagementView } from './views/OpenTimeManagement';
import { StatisticsView } from './views/Statistics';
import { UserView } from './views/User';

import { PrivateRoute } from './components/PrivateRoute';
import { RouteConstants } from './constants';

const App = () => {
    return (
        <Router>
            <Switch>
                <Redirect exact from="/" to={RouteConstants.DashboardView} />
                <PrivateRoute exact path={RouteConstants.DashboardView} component={DashboardView} />
                <PrivateRoute exact path={RouteConstants.PatientsView} component={PatientsView} />
                <PrivateRoute exact path={RouteConstants.PatientDetailView} component={PatientDetailView} />
                <PrivateRoute exact path={RouteConstants.PatientManagementView} component={PatientManagementView} />
                <PrivateRoute exact path={RouteConstants.PrescriptionsView} component={PrescriptionsView} />
                <PrivateRoute exact path={RouteConstants.PrescriptionDetailView} component={PrescriptionDetailView} />
                <PrivateRoute exact path={RouteConstants.PrescriptionManagementView} component={PrescriptionManagementView} />
                <PrivateRoute exact path={RouteConstants.ServiceFormView} component={ServiceFormView} />
                <PrivateRoute exact path={RouteConstants.CtFormView} component={CtFormView} />
                <PrivateRoute exact path={RouteConstants.MriFormView} component={MriFormView} />
                <PrivateRoute exact path={RouteConstants.TestFormView} component={TestFormView} />
                <PrivateRoute exact path={RouteConstants.XqFormView} component={XqFormView} />
                <PrivateRoute exact path={RouteConstants.UserManagementView} component={UserManagementView} />
                <PrivateRoute exact path={RouteConstants.DrugManagementView} component={DrugManagementView} />
                <PrivateRoute exact path={RouteConstants.DataInputManagementView} component={DataInputManagementView} />
                <PrivateRoute exact path={RouteConstants.OpenTimeManagementView} component={OpenTimeManagementView} />
                <PrivateRoute exact path={RouteConstants.StatisticsView} component={StatisticsView} />
                <PrivateRoute exact path={RouteConstants.UserView} component={UserView} />
                <Route exact path={RouteConstants.LoginView} component={LoginView} />
                <Redirect to={RouteConstants.DashboardView} />
            </Switch>
        </Router>
    );
}

export default App;
