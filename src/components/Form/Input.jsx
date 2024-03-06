import React, { useId } from "react";
import PropTypes from "prop-types";

const Input = React.forwardRef(function Input({
    type = 'text',
    label,
    placeholder,
    className = '',
    ...props
}, ref) {
    const id = useId();
    return (
        <div className="w-full px-4 py-2">
            {label && <label htmlFor={id}>{label}</label>}
            <input ref={ref} type={type} id={id} placeholder={placeholder} className={`w-full ${className}`} {...props} />
        </div>
    )
})

Input.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string
}

export default Input;