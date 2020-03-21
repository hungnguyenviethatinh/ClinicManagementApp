import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography
} from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
import { Button, FabButton } from '../../components/Button';
import { Status } from '../../components/Status';
import { SearchInput } from '../../components/SearchInput';
import { DeleteConfirm } from '../../components/DeleteConfirm';
import { Select } from '../../components/Select';
import { CheckBox } from '../../components/CheckBox';
import { DatePicker } from '../../components/DatePicker';

import {
    DrugStatus,
    ExpiredSessionMsg,
    DataDateTimeFormat,
} from '../../constants';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    GetAllMedicinesUrl,
    GetMedicineUrl,
    AddMedicineUrl,
    UpdateMedicineUrl,
    DeleteMedicineUrl,
    GetUnitUrl,
    AddIngredientsUrl,
    GetIngredientsUrl,
    DeleteIngredientsUrl,
} from '../../config';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(0),
    },
    actions: {
        justifyContent: 'flex-end',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

const medicineColumns = [
    {
        title: 'Mã thuốc', field: 'idCode',
    },
    {
        title: 'Tên thuốc', field: 'name',
    },
    {
        title: 'Tên tắt', field: 'shortName',
    },
    {
        title: 'Hảm lượng', field: 'netWeight',
    },
    {
        title: 'Số lượng', field: 'quantity', type: 'numeric',
    },
    {
        title: 'Đơn vị', field: 'unit',
    },
    {
        title: 'Giá', field: 'price',
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            const status = [
                DrugStatus.No,
                DrugStatus.Yes][rowData.status]
            return <Status status={status} />
        },
    },
];

const findByOptions = [
    { label: 'Mã thuốc', value: 'IdCode' },
    { label: 'Tên thuốc', value: 'Name' },
    { label: 'Tên tắt', value: 'ShortName' },
    { label: 'Tên hoạt chất', value: 'Ingredient' },
];

const getMedicinesLogMsfHeader = '[Get Medicines Error]';
const getMedicineLogMsfHeader = '[Get Medicine Error]';
const addMedicineLogMsfHeader = '[Add Medicine Error]';
const updateMedicineLogMsfHeader = '[Update Medicine Error]';
const deleteMedicineLogMsfHeader = '[Delete Medicine Error]';
const getUnitsLogMsfHeader = '[Get Units Error]';
const getIngredientLogHeader = '[Get Ingredients Error]';
const addIngredientLogHeader = '[Add Ingredients Error]';
const updateIngredientLogHeader = '[Update Ingredients Error]';
const deleteIngredientLogHeader = '[Delete Ingredients Error]';

const DrugManagement = () => {

    const classes = useStyles();

    const tableRef = React.useRef(null);
    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

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

    const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
    const onOpenDeleteConfirm = () => {
        setOpenDeleteConfirm(true);
    };
    const handlCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
    };

    const handleError = (reason, logMsgHeader) => {
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
        console.log(`${logMsgHeader}`, reason);
    };

    const [isChecked, setIsChecked] = React.useState(false);
    const handleCheck = event => {
        setIsChecked(!isChecked);
    };

    const [findByValue, setFindByValue] = React.useState('IdCode');
    const handleFindByChange = event => {
        setFindByValue(event.target.value);
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };
    const handleSearch = event => {
        event.preventDefault();
        // setLoadingSearch(true);
        refreshData();
    };

    const [filterDateValue, setFilterDateValue] = React.useState(null);
    const handleFilterDateChange = date => {
        setFilterDateValue(date);
        if (moment(date).isValid()) {
            // setLoadingSearch(true);
            refreshData();
        }
    };

    const [medicine, setMedicine] = React.useState({
        IdCode: '',
        Name: '',
        ShortName: '',
        NetWeight: '',
        Quantity: '',
        Unit: '',
        Price: '',
    });
    const handleMedicineChange = prop => event => {
        setMedicine({
            ...medicine,
            [prop]: event.target.value,
        })
    };

    const [ingredients, setIngredients] = React.useState([{
        Name: '',
        MedicineId: 0,
    }]);
    const handleIngredientsChange = (index, prop) => event => {
        ingredients[index][prop] = event.target.value;
        setIngredients([...ingredients]);
    };
    const handlePopIngredient = index => event => {
        if (!updateMode || (updateMode && isChecked)) {
            ingredients.splice(index, 1);
            setIngredients([...ingredients]);
        }
    };
    const handlePushIngredient = () => {
        if (!updateMode || (updateMode && isChecked)) {
            ingredients.push({
                Name: '',
                MedicineId: 0,
            });
            setIngredients([...ingredients]);
        }
    };

    const handleMedicineKeyPress = event => {
        if (event.key === 'Enter') {
            handleDone();
        }
    };

    const handleReset = () => {
        setMedicine({
            IdCode: '',
            Name: '',
            ShortName: '',
            NetWeight: '',
            Quantity: '',
            Unit: '',
            Price: '',
        });
        setIngredients([{
            Name: '',
            MedicineId: 0,
        }]);
    };

    const [disabled, setDisabled] = React.useState(false);
    const [loadingDelete, setLoadingDelete] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);
    // const [loadingSearch, setLoadingSearch] = React.useState(false);

    const handleDone = () => {
        if (!medicine.Name.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên thuốc!');
            return;
        }
        if (!medicine.IdCode.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mã thuốc!');
            return;
        }
        if (!medicine.ShortName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên tắt của thuốc!');
            return;
        }
        if (!medicine.NetWeight.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập hàm lượng thuốc!');
            return;
        }
        if (ingredients.length > 1) {
            for (let ingredient of ingredients) {
                if (!ingredient.Name.trim()) {
                    handleSnackbarOption('error', 'Yêu cầu nhập tên hoạt chất/biệt dược!');
                    return;
                }
            }
        }
        if (!medicine.Quantity.toString().trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập số lượng thuốc!');
            return;
        }
        if (medicine.Quantity.toString().trim() && !_.isFinite(_.toNumber(medicine.Quantity))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số cho số lượng thuốc!');
            return;
        }
        if (!medicine.Unit.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập đơn vị thuốc!');
            return;
        }
        if (!medicine.Price.toString().trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập giá bán thuốc!');
            return;
        }
        if (medicine.Price.toString().trim() && !_.isFinite(_.toNumber(medicine.Price))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số cho giá thuốc!');
            return;
        }

        setDisabled(true);
        setLoadingDone(true);

        const medicineModel = {
            IdCode: medicine.IdCode.trim(),
            Name: medicine.Name.trim(),
            ShortName: medicine.ShortName.trim(),
            NetWeight: medicine.NetWeight.trim(),
            Quantity: _.toNumber(medicine.Quantity),
            Unit: medicine.Unit,
            Price: _.toNumber(medicine.Price),
        };

        if (!updateMode) {
            addMedicine(medicineModel);
        } else {
            const { id } = selectedRow;
            updateMedicine(id, medicineModel);
        }
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        setDisabled(true);
        setLoadingDelete(true);
        deleteMedicine(id);
        setOpenDeleteConfirm(false);
    };

    const config = axiosRequestConfig();

    const addMedicine = (medicineModel) => {
        Axios.post(AddMedicineUrl, medicineModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm thuốc vào kho dữ liêu thành công!');
                const { id } = data;
                if (ingredients.length > 1 || (true && ingredients[0].Name.trim())) {
                    const ingredientModels = [];
                    ingredients.map(({ Name }) => ingredientModels.push({
                        Name,
                        MedicineId: id,
                    }));
                    addIngredients(ingredientModels);
                }

                handleReset();
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi thêm thuốc vào kho dữ liệu. Vui lòng thử lại!');
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleError(reason, addMedicineLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm thuốc vào kho dữ liệu. Vui lòng thử lại!');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const addIngredients = (ingredientModels) => {
        Axios.post(AddIngredientsUrl, ingredientModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm hoạt chất/biệt dược thành công!');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi thêm hoạt chất/biệt dược. Vui lòng thử lại!');
            }
        }).catch((reason) => {
            handleError(reason, addIngredientLogHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm hoạt chất/biệt dược. Vui lòng thử lại!');
        });
    };

    const updateMedicine = (id, medicineModel) => {
        const url = `${UpdateMedicineUrl}/${id}`;
        Axios.put(url, medicineModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật dữ liệu thuốc thành công!');
                if (isChecked) {
                    deleteIngredients(id);
                }
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin thuốc. Vui lòng thử lại!');
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleError(reason, updateMedicineLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin thuốc. Vui lòng thử lại!');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const deleteMedicine = (id) => {
        Axios.delete(`${DeleteMedicineUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thuốc đã được xóa thành công!');
                handleReset();
                setSelectedRow(null);
                setUpdateMode(false);
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa loại thuốc này. Vui lòng thử lại!');
            }
            setDisabled(false);
            setLoadingDelete(false);
        }).catch((reason) => {
            handleError(reason, deleteMedicineLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa loại thuốc này. Vui lòng thử lại!');
            setDisabled(false);
            setLoadingDelete(false);
        });
    };

    const deleteIngredients = (medicineId) => {
        const url = `${DeleteIngredientsUrl}/${medicineId}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log(`Remove all ingredients of medicine ${medicineId}.`);

                if (ingredients.length > 1 || (true && ingredients[0].Name.trim())) {
                    const ingredientModels = [];
                    ingredients.map(({ Name }) => ingredientModels.push({
                        Name,
                        MedicineId: medicineId,
                    }));
                    addIngredients(ingredientModels);
                }
            } else {
                handleError(response, deleteIngredientLogHeader);
            }
        }).catch((reason) => {
            handleError(reason, deleteIngredientLogHeader);
        });
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            const { id } = rowData;
            getMedicine(id);
            setUpdateMode(true);
        } else {
            setSelectedRow(null);
            handleReset();
            setUpdateMode(false);
            setIsChecked(false);
        }
    };

    const getMedicine = (id) => {
        setDisabled(true);
        const url = `${GetMedicineUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { idCode, name, shortName, netWeight, quantity, unit, price } = data[0];
                setMedicine({
                    IdCode: idCode,
                    Name: name,
                    ShortName: shortName,
                    NetWeight: netWeight,
                    Quantity: quantity,
                    Unit: unit,
                    Price: price,
                });
                getIngredients(id);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getMedicineLogMsfHeader);
            setDisabled(false);
        });
    };

    const getIngredients = (medicineId) => {
        const url = `${GetIngredientsUrl}/${medicineId}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                if (!_.isEmpty(data)) {
                    const ingredientModels = [];
                    data.map(({ name, medicineId }) => ingredientModels.push({
                        Name: name,
                        MedicineId: medicineId,
                    }));
                    setIngredients(ingredientModels);
                } else {
                    setIngredients([{
                        Name: '',
                        MedicineId: 0,
                    }]);
                }
            } else {
                handleError(response, getIngredientLogHeader);
            }
        }).catch((reason) => {
            handleError(reason, getIngredientLogHeader);
        });
    };

    const getMedicines = (resolve, reject, query) => {
        setDisabled(true);
        const value = searchValue.trim();
        const filterDate = filterDateValue ? filterDateValue.format(DataDateTimeFormat) : null;

        Axios.get(GetAllMedicinesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: value,
                findBy: findByValue,
                filterDate,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, medicines } = data[0];
                const { page } = query;

                resolve({
                    data: medicines,
                    page,
                    totalCount,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getMedicinesLogMsfHeader);
            setDisabled(false);
        });
    };

    const [unitOptions, setUnitOptions] = React.useState([{
        label: '',
        value: '',
    }]);
    const getUnitOptions = () => {
        setDisabled(true);
        Axios.get(GetUnitUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ name }) => options.push({
                    label: name,
                    value: name,
                }));
                setUnitOptions(options);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getUnitsLogMsfHeader);
            setDisabled(false);
        });
    };

    React.useEffect(() => {
        getUnitOptions();
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="QUẢN LÝ THUỐC"
                        subheader="Thêm, cập nhật thuốc tại đây"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography
                                variant="caption"
                                component="p"
                                children="BIỂU MẪU THÊM THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="Name"
                                        label="Tên thuốc"
                                        value={medicine.Name}
                                        onChange={handleMedicineChange('Name')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="IdCode"
                                        label="Mã thuốc"
                                        value={medicine.IdCode}
                                        onChange={handleMedicineChange('IdCode')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="ShortName"
                                        label="Tên tắt"
                                        value={medicine.ShortName}
                                        onChange={handleMedicineChange('ShortName')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="NetWeight"
                                        label="Hàm lượng"
                                        value={medicine.NetWeight}
                                        onChange={handleMedicineChange('NetWeight')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                {
                                    updateMode &&
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <CheckBox
                                            label="Thay đổi hoạt chất/biệt dược"
                                            checked={isChecked}
                                            onChange={handleCheck}
                                        />
                                    </Grid>
                                }
                                {
                                    ingredients.map((ingredient, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                                                <TextField
                                                    fullWidth
                                                    id={`Name_${index}`}
                                                    label="Thêm Hoạt chất/ Biệt dược"
                                                    value={ingredient.Name}
                                                    onChange={handleIngredientsChange(index, 'Name')}
                                                    readOnly={updateMode && !isChecked}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <Grid
                                                    container
                                                    justify="flex-end"
                                                    alignItems="center"
                                                    spacing={2}
                                                    style={{ width: '100%', margin: 0 }}
                                                >
                                                    {
                                                        ingredients.length > 1 &&
                                                        <Grid item>
                                                            <FabButton
                                                                color="danger"
                                                                iconName="delete"
                                                                onClick={handlePopIngredient(index)}
                                                            />
                                                        </Grid>
                                                    }
                                                    {
                                                        index === ingredients.length - 1 &&
                                                        <Grid item>
                                                            <FabButton
                                                                color="success"
                                                                iconName="add"
                                                                onClick={handlePushIngredient}
                                                            />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                    ))
                                }
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Quantity"
                                        label="Số lượng"
                                        value={medicine.Quantity}
                                        onChange={handleMedicineChange('Quantity')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Select
                                        fullWidth
                                        id="Unit"
                                        label="Đơn vị"
                                        value={medicine.Unit}
                                        options={unitOptions}
                                        onChange={handleMedicineChange('Unit')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Price"
                                        label="Giá bán"
                                        placeholder={`...đồng/${medicine.Unit}`}
                                        value={medicine.Price}
                                        onChange={handleMedicineChange('Price')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="flex-end"
                                style={{ marginTop: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                {
                                    selectedRow &&
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Button
                                            fullWidth
                                            disabled={disabled}
                                            loading={loadingDelete}
                                            color="danger"
                                            children="Xóa"
                                            iconName="delete"
                                            onClick={onOpenDeleteConfirm}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingDone}
                                        color="success"
                                        children={selectedRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedRow ? 'save' : 'done'}
                                        onClick={handleDone}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="DANH SÁCH THUỐC"
                        subheader="Danh sách thuốc đã có dữ liệu trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={classes.paper}
                            style={{ paddingBottom: 10 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                children="TÌM KIẾM THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} alignItems="center" >
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <Select
                                        fullWidth
                                        id="findBy"
                                        label="Tìm theo"
                                        value={findByValue}
                                        options={findByOptions}
                                        onChange={handleFindByChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                                    <SearchInput
                                        placeholder="Nhập tên thuốc, mã thuốc, tên tắt, tên hoạt chất để tìm kiếm"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onSearch={handleSearch}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                                    <DatePicker
                                        id="filterDatePicker"
                                        label="Lọc theo ngày"
                                        value={filterDateValue}
                                        onChange={(date) => handleFilterDateChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        // loading={loadingSearch}
                                        color="success"
                                        children="Tìm kiếm"
                                        iconName="search"
                                        onClick={handleSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={tableRef}
                            columns={medicineColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getMedicines(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <DeleteConfirm
                open={openDeleteConfirm}
                handleClose={handlCloseDeleteConfirm}
                handleDelete={handleDelete}
            />
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
}

export default DrugManagement;
