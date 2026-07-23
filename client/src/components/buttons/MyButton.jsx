import React from 'react';
import "./myButton.scss"

const MyButton = ({buttonContent, onClickFunction, type}) => {
    return (
        <button className="myButton" onClick={onClickFunction} type={type}>
            {buttonContent}
        </button>
    );
};

export default MyButton;