import React from 'react';
import {
    FormControl,
    TextField,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = {
    root: { },
};

const TextFieldComponent = props => {
    const { 
        classes, className, autoFocus, error, fullWidth, helperText, style,
        id, label, name, onChange, required, readOnly, value, maxLength,
        placeholder,
    } = props;

    const [showPassword, setShowPassword] = React.useState(false);

    const [type, setType] = React.useState(props.type);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
        setType(type === 'password' ? 'text' : props.type)
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    return (
        <FormControl
            className={clsx(classes.root, className)}
            fullWidth={fullWidth}
            margin="dense"
            style={style}
        >
            <TextField
                variant="outlined"
                margin="dense"
                required={required}
                name={name}
                label={label}
                type={type}
                id={id}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                inputProps={{
                    maxLength,
                }}
                InputProps={{
                    endAdornment: (type === 'password' || showPassword) && (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                aria-label="Toggle password visibility."
                                onClick={handleShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    readOnly
                }}
                error={error}
                helperText={(error) ? helperText : ''}
                autoFocus={autoFocus}
                className={classes.root}
            />
        </FormControl>
    );
};

TextFieldComponent.propTypes = {
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    style: PropTypes.object,
    placeholder: PropTypes.string,
};

TextFieldComponent.defaultProps = {
    autoFocus: false,
    classes: null,
    error: false,
    fullWidth: false,
    helperText: '',
    id: '',
    label: '',
    name: '',
    onChange: () => { },
    required: false,
    readOnly: false,
    type: 'text',
    value: '',
    maxLength: 100,
    style: null,
    placeholder: '',
};

export default withStyles(styles)(TextFieldComponent);