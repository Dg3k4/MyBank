import React from 'react';
import "./myInput.scss"

const MyInput = ({label, idName, type, onChange, content, required = false}) => {
    return (
        <div className="field">
            <label className="field__label" htmlFor={`field__container__${idName}`}>
                {label}
            </label>
            <div className="field__container">
                <input id={`field__container__${idName}`} className="field__container__input" type={type} onChange={onChange} required={required}/>
                <div className="field__container">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default MyInput;