import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { Button } from '../Button';

const useStyles = makeStyles({
    paper: {
        padding: '0px 24px',
    },
    title: {
        padding: '16px 8px',
    },
    content: {
        padding: '8px',
    },
    action: {
        justifyContent: 'center',
    },
});

const DeleteConfirmDialog = (props) => {
    const { open, handleClose, handleDelete } = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-confirmation"
                classes={{
                    paper: classes.paper,
                }}
            >
                <DialogTitle
                    id="delete-confirmation"
                    classes={{
                        root: classes.title,
                    }}>Xác nhận xóa</DialogTitle>
                <DialogContent
                    classes={{
                        root: classes.content,
                    }}>
                    <DialogContentText>
                        Nhấn Xóa để xóa, Hủy để hủy thao tác này!
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    classes={{
                        root: classes.action,
                    }}>
                    <Grid container spacing={2} justify="center">
                        <Grid item sm={6}>
                            <Button
                                fullWidth
                                color="danger"
                                children="Xóa"
                                iconName="delete"
                                onClick={handleDelete}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <Button
                                autoFocus
                                fullWidth
                                color="warning"
                                children="Hủy"
                                iconName="cancel"
                                onClick={handleClose}
                                style={{ marginRight: 16 }}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </div>
    );
};

DeleteConfirmDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleDelete: PropTypes.func,
};

DeleteConfirmDialog.defaultProps = {
    open: false,
    handleClose: () => { },
    handleDelete: () => { },
};

export default DeleteConfirmDialog;
