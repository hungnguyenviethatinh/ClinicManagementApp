import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import StoreIcon from '@material-ui/icons/Store';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ViewListIcon from '@material-ui/icons/ViewList';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ListAltIcon from '@material-ui/icons/ListAlt';

import { Menu } from '../Menu';
import Profile from '../Profile';

import { verifyJWT } from '../../common';
import {
    RoleConstants,
    RouteConstants,
    AccessTokenKey,
} from '../../constants';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up('lg')]: {
            marginTop: 64,
            height: 'calc(100% - 64px)'
        }
    },
    root: {
        backgroundColor: theme.palette.white,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: theme.spacing(2)
    },
    divider: {
        margin: theme.spacing(2, 0)
    },
    nav: {
        marginBottom: theme.spacing(2)
    }
}));

const adminMenus = [
    {
        title: 'Bảng điều khiển',
        href: RouteConstants.DashboardView,
        icon: <DashboardIcon />
    },
    {
        title: 'Quản lí nhân viên',
        href: RouteConstants.UserManagementView,
        icon: <PeopleIcon />
    },
    {
        title: 'Quản lí thuốc',
        href: RouteConstants.DrugManagementView,
        icon: <StoreIcon />
    },
    {
        title: 'Quản lí nhập liệu',
        href: RouteConstants.DataInputManagementView,
        icon: <ImportContactsIcon />
    },
    {
        title: 'Quản lí giờ khám',
        href: RouteConstants.OpenTimeManagementView,
        icon: <AccessTimeIcon />
    },
    {
        title: 'Thống kê',
        href: RouteConstants.StatisticsView,
        icon: <EqualizerIcon />
    },
];

const doctorMenus = [
    {
        title: 'Bảng điều khiển',
        href: RouteConstants.DashboardView,
        icon: <DashboardIcon />
    },
    {
        title: 'Danh sách bệnh nhân',
        href: RouteConstants.PatientsView,
        icon: <ViewListIcon />
    },
    {
        title: 'Kê đơn thuốc',
        href: RouteConstants.PrescriptionManagementView,
        icon: <ReceiptIcon />
    },
    {
        title: 'Kê đơn chỉ định',
        href: RouteConstants.ServiceFormView,
        icon: <ListAltIcon />
    },
];

const receptionistMenus = [
    {
        title: 'Bảng điều khiển',
        href: RouteConstants.DashboardView,
        icon: <DashboardIcon />
    },
    {
        title: 'Quản lý và Tiếp nhận bệnh nhân',
        href: RouteConstants.PatientManagementView,
        icon: <ViewListIcon />
    },
    {
        title: 'Danh sách đơn thuốc',
        href: RouteConstants.PrescriptionsView,
        icon: <ReceiptIcon />
    },
];

const Sidebar = props => {
    const { open, variant, onClose, className, ...rest } = props;

    const classes = useStyles();

    const [menus, setMenus] = React.useState([]);

    const prepareMenus = () => {
        const token = localStorage.getItem(AccessTokenKey);

        verifyJWT(token, RoleConstants.AdministratorRoleName) && setMenus(adminMenus);
        verifyJWT(token, RoleConstants.DoctorRoleName) && setMenus(doctorMenus);
        verifyJWT(token, RoleConstants.ReceptionistRoleName) && setMenus(receptionistMenus);
    };

    React.useEffect(() => {
        prepareMenus();
    }, []);

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            <div
                {...rest}
                className={clsx(classes.root, className)}
            >
                <Profile />
                <Divider className={classes.divider} />
                <Menu
                    className={classes.nav}
                    menus={menus}
                />
            </div>
        </Drawer>
    );
};

Sidebar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired
};

export default Sidebar;
