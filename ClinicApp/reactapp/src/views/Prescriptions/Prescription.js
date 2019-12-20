import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import _ from 'lodash';
import moment from 'moment';

import { Button } from '../../components/Button';
import { Snackbar } from '../../components/Snackbar';
import { HistoryButton as Back } from '../../components/Button';

import Axios, {
    axiosRequestConfig,
    chromely,
} from '../../common';
import {
    PrescriptionUrl,
    PrescriptionPrintUrl,
    UpdatePrescriptionStatusUrl,
} from '../../config';
import {
    ExpiredSessionMsg,
    NotFoundMsg,
    Gender,
    DisplayDateFormat,
    DisplayDateTimeFormat,
    PrescriptionStatus,
} from '../../constants';

import logo from '../../assets/images/logo.png';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(3),
    },
    actions: {
        justifyContent: 'flex-end',
    },
    paper: {
        border: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: theme.spacing(2),
    },
    footer: {
        width: '100%',
        height: '100px',
        display: 'flex',
        border: '1px solid rgb(224, 224, 224)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
}));

const encodeId = (id) => {
    return `${_.padStart(_.toString(id), 4, '0')}`;
};

const getPrescriptionError = '[Get Prescription Error]';
const updatePrescriptionError = '[Update Prescription Error]';

const Prescription = () => {
    const classes = useStyles();
    const { id } = useParams();

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const [snackbarOption, setSnackbarOption] = React.useState({
        variant: 'success',
        message: '',
    });
    const handleSnackbarOption = (variant, message) => {
        setSnackbarOption({
            variant,
            message,
        });
        setOpenSnackbar(true);
    };

    const handleError = (reason, logError) => {
        if (reason.response) {
            const { status } = reason.response;
            if (status === 401) {
                handleSnackbarOption('error', ExpiredSessionMsg);
            } else {
                if (status === 404) {
                    handleSnackbarOption('error', NotFoundMsg);
                }
            }
        }
        console.log(logError, reason);
    };

    const [doctor, setDoctor] = React.useState({
        FullName: '',
    });
    const [patient, setPatient] = React.useState({
        Id: '',
        FullName: '',
        DateOfBirth: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: '',
    });
    const [prescription, setPrescription] = React.useState({
        Diagnosis: '',
        Note: '',
    });
    const [medicines, setMedicines] = React.useState([{
        MedicineName: '',
        Quantity: '',
        Unit: '',
        TimesPerDay: '',
        AfterBreakfast: '',
        AfterLunch: '',
        Afternoon: '',
        AfterDinner: '',
        Note: '',
    }]);

    const handlePrint = () => {
        const data = JSON.stringify({
            doctor,
            patient,
            prescription,
            medicines,
        });

        chromely.post(PrescriptionPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                handleSnackbarOption('success', 'Đơn thuốc đã được in thành công!');
                updatePrescriptionStatus();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in đơn thuốc!');
                console.log('[Print Prescription Error] - An error occurs during message routing. With url: '
                    + PrescriptionPrintUrl
                    + '. Response received: ', response);
            }
        });
    };

    const config = axiosRequestConfig();

    const getPrescription = () => {
        const url = `${PrescriptionUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { diagnosis, note } = data[0];
                setPrescription({
                    Diagnosis: diagnosis,
                    Note: note,
                });

                setDoctor({
                    FullName: data[0].doctor.fullName,
                });

                const {
                    fullName,
                    dateOfBirth,
                    gender,
                    address,
                    phoneNumber,
                    appointmentDate,
                } = data[0].patient;

                const AppointmentDate =
                    (moment(appointmentDate).isValid() && moment(appointmentDate) >= moment()) ?
                        moment(appointmentDate).format(DisplayDateTimeFormat) : null;
                const DateOfBirth = moment(dateOfBirth).isValid() ? moment(dateOfBirth).year() : null;
                setPatient({
                    Id: encodeId(data[0].patient.id),
                    FullName: fullName,
                    DateOfBirth,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                    AppointmentDate,
                });

                const ms = [];
                data[0].medicines.map((m) => {
                    const {
                        medicine,
                        quantity,
                        unit,
                        timesPerDay,
                        afterBreakfast,
                        afterLunch,
                        afternoon,
                        afterDinner,
                        note,
                    } = m;
                    ms.push({
                        MedicineName: medicine.name,
                        Quantity: quantity,
                        Unit: unit,
                        TimesPerDay: timesPerDay,
                        AfterBreakfast: afterBreakfast,
                        AfterLunch: afterLunch,
                        Afternoon: afternoon,
                        AfterDinner: afterDinner,
                        Note: note,
                    });
                });
                setMedicines(ms);
            }
        }).catch((reason) => {
            handleError(reason, getPrescriptionError);
        });
    };

    const updatePrescriptionStatus = () => {
        const url = `${UpdatePrescriptionStatusUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', `Đã cập nhật trạng thái đơn thuốc thành ${PrescriptionStatus.IsPrinted}!`);
            } else {
                console.log(response);
            }
        }).catch((reason) => {
            handleError(reason, updatePrescriptionError);
        });
    }

    React.useEffect(() => {
        getPrescription();
    }, []);

    return (
        <Grid
            container
            spacing={3}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Back />
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        action={
                            <Button
                                color="warning"
                                children="In"
                                iconName="print"
                                onClick={handlePrint}
                            />
                        }
                        title="ĐƠN THUỐC"
                        subheader="Xem chi tiết thuốc và in"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="center"
                                style={{ marginBottom: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <div style={{ width: '100%' }} >
                                        <img
                                            src={`/${logo}`}
                                            alt="Dr. Khoa Clinic"
                                            style={{ height: 'auto', width: '100%', }}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Typography
                                        component="h2"
                                        variant="h2"
                                        children="Dr. KHOA Clinic"
                                        style={{ fontWeight: 600 }}
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children="ĐT:       0838.131973"
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children="Email:    clinic.drkhoa@gmail.com"
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children="Website:  www.drkhoaclinic.com"
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children="Đc: 6A, Đường 36, Phường Tân Quy, Q7, TP.HCM"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Grid
                                        container
                                        spacing={2}
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="left"
                                                component="p"
                                                variant="body1"
                                                children="DKC-BN:"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="left"
                                                component="p"
                                                variant="body1"
                                                children={`${patient.Id}`}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="left"
                                                component="p"
                                                variant="body1"
                                                children="Ngày:"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="left"
                                                component="p"
                                                variant="body1"
                                                children={moment().format(DisplayDateFormat)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="left"
                                                component="p"
                                                variant="body1"
                                                children="Giờ:"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="left"
                                                component="p"
                                                variant="body1"
                                                children={moment().format('HH:mm')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Typography
                                component="h1"
                                variant="h1"
                                children="ĐƠN THUỐC"
                                align="center"
                                style={{ marginBottom: 24, fontWeight: 600 }}
                            />
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="baseline"
                                style={{ marginBottom: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Họ tên BN:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.FullName}`}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="body1"
                                        children="Năm sinh:"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.DateOfBirth || '......'}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="body1"
                                        children="Giới tính:"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.Gender}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Địa chỉ:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.Address}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="ĐT:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.PhoneNumber}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Chẩn đoán:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${prescription.Diagnosis}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div style={{ width: '100%', padding: '16px 0px' }}>
                                        <Grid
                                            container
                                            spacing={2}
                                            justify="center"
                                            alignItems="baseline"
                                        >
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children="STT"
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children="MẶT HÀNG THUỐC"
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <Typography
                                                    align="center"
                                                    component="h5"
                                                    variant="h5"
                                                    children="SỐ LƯỢNG"
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children="ĐƠN VỊ"
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            {
                                                !_.isEmpty(medicines) && medicines.map((m, index) => (
                                                    <React.Fragment key={index}>
                                                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                            <Typography
                                                                align="center"
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${index + 1}`}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                            <Typography
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${m.MedicineName}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                            <Typography
                                                                align="center"
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${m.Quantity}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                            <Typography
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${m.Unit}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>
                                                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                component="p"
                                                                variant="subtitle1"
                                                                children={
                                                                    `Ngày uống: ${m.TimesPerDay || '...'} lần,
                                                                    ${' '}Sáng: ${m.AfterBreakfast || '...'} ${m.Unit},
                                                                    ${' '}Trưa: ${m.AfterLunch || '...'} ${m.Unit}, 
                                                                    ${' '}Chiều: ${m.Afternoon || '...'} ${m.Unit}, 
                                                                    ${' '}Tối: ${m.AfterDinner || '...'} ${m.Unit}`
                                                                }
                                                                style={{ fontStyle: 'italic' }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                            <Typography
                                                                component="p"
                                                                variant="subtitle1"
                                                                children={`Lưu ý: ${m.Note || '............'}`}
                                                                style={{ fontStyle: 'italic' }}
                                                            />
                                                        </Grid>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div style={{ width: '100%', padding: '16px 0px' }}>
                                        <Grid
                                            container
                                            spacing={2}
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children={`Dặn dò: ${prescription.Note || '............'}`}
                                                    style={{ textDecoration: 'underline', fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <Typography
                                                    align="center"
                                                    component="h5"
                                                    variant="h5"
                                                    children="Bác sĩ"
                                                    style={{ fontWeight: 600 }}
                                                />
                                                <Typography
                                                    align="center"
                                                    component="p"
                                                    variant="caption"
                                                    children="(Kí, Họ tên)"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children={`Tái khám: ${patient.AppointmentDate || '............'}`}
                                                    style={{ textDecoration: 'underline', fontWeight: 600 }}
                                                />
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children="* Giờ khám bệnh:"
                                                    style={{ fontWeight: 600 }}
                                                />
                                                <Typography
                                                    component="p"
                                                    variant="body2"
                                                    children="- Thứ 3 và thứ 5: chiều từ 17:00 đến 20:00"
                                                />
                                                <Typography
                                                    component="p"
                                                    variant="body2"
                                                    children="- Thứ 7: sáng từ 8:00 đến 11:00"
                                                />
                                            </Grid>
                                            <Grid
                                                container
                                                item
                                                justify="center"
                                                alignItems="flex-end"
                                                xs={12} sm={12} md={3} lg={3} xl={3}
                                            >
                                                <Typography
                                                    align="center"
                                                    component="h5"
                                                    variant="h5"
                                                    children={`${doctor.FullName}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <Typography
                                                    component="p"
                                                    variant="body2"
                                                    children="* Đơn thuốc có giá trị trong đợt khám. Tái khám khách hàng nhớ mang theo đơn thuốc."
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={3}
                                justify="center"
                                alignItems="center"
                                style={{ marginBottom: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div className={classes.footer}>
                                        <Typography
                                            align="center"
                                            component="h5"
                                            variant="body1"
                                            children="* Đặt lịch khám, tái khám theo số điện thoại: 0838.131973"
                                        />
                                        <Typography
                                            align="center"
                                            component="h5"
                                            variant="body1"
                                            children="(Quý khách vui lòng để lại tin nhắn khi chưa gọi điện thoại được.)"
                                            style={{ fontStyle: 'italic' }}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Snackbar
                vertical="bottom"
                horizontal="right"
                variant={snackbarOption.variant}
                message={snackbarOption.message}
                open={openSnackbar}
                handleClose={handleSnackbarClose}
            />
        </Grid>
    );
};

export default Prescription;
