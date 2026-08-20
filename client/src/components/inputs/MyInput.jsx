import React from 'react';
import "./myInput.scss"

const MyInput = ({label, idName, type, onChange, content, placeHolder, className = "", inputClassName = "", required = false}) => {
    return (
        <div className={`field ${className}`}>
            <label className="field__label" htmlFor={`field__container__${idName}`}>
                {label}
            </label>
            <div className="field__container">
                <input placeholder={placeHolder} id={`field__container__${idName}`} className={`field__container__input ${inputClassName}`} type={type} onChange={onChange} required={required}/>
                <div className="field__container">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default MyInput;