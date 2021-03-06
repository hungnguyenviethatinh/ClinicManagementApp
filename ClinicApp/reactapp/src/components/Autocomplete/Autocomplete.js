import React from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = {
    root: {},
};

const AutocompleteComponent = props => {

    const {
        classes,
        className,
        id,
        label,
        value,
        fullWidth,
        multiple,
        freeSolo,
        options,
        onChange,
        onBlur,
        getOptionLabel,
        margin,
        disabled,
        ...rest
    } = props;

    return (
        <FormControl
            className={clsx(classes.root, className)}
            fullWidth={fullWidth}
            margin={margin}
        >
            <Autocomplete
                disabled={disabled}
                multiple={multiple}
                freeSolo={freeSolo}
                id={id}
                options={options}
                getOptionLabel={getOptionLabel}
                noOptionsText={`Không có lựa chọn nào`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label}
                        variant="outlined"
                        margin="dense"
                        className={classes.root}
                        fullWidth
                    />
                )}
                {...rest}
            />
        </FormControl>
    );
};

AutocompleteComponent.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    fullWidth: PropTypes.bool,
    multiple: PropTypes.bool,
    freeSolo: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.any),
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    getOptionLabel: PropTypes.func,
};

AutocompleteComponent.defaultProps = {
    classes: null,
    id: '',
    label: '',
    value: null,
    fullWidth: false,
    multiple: false,
    freeSolo: false,
    options: [],
    margin: 'none',
    disabled: false,
    onChange: () => { },
    onBlur: () => { },
    getOptionLabel: () => { },
};

export default withStyles(styles)(AutocompleteComponent);
