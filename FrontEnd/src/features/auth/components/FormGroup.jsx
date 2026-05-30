import React from 'react'

const FormGroup = ({label, placeholder, value, onchange, type = "text", icon, children}) => {
  return (
    <div className="form-group">
        <label htmlFor={label}>{label}</label>
        <div className="input-container">
            {icon && <div className="field-icon">{icon}</div>}
            <input
              value={value}
              onChange={onchange}
              type={type}
              id={label}
              name={label}
              placeholder={placeholder}
              className={icon ? 'has-icon' : ''}
            />
            {children}
        </div>
    </div>
  )
}

export default FormGroup