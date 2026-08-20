import React from 'react';

const BurgerIcon = ({onClick}) => {
    return (
        <svg onClick={onClick} className="burger" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M 36 60 H 204 M 36 120 H 204 M 36 180 H 204"
                stroke="currentColor"
                strokeWidth="12.5"
                strokeLinecap="butt"
            />
        </svg>
    );
};

export default BurgerIcon;