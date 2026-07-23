import React from 'react';

const CrossIcon = ({className}) => {
    return (
        <svg
            className={className}
            width="240"
            height="240"
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
        >
            <path
                d="M48 48L192 192M192 48L48 192"
                stroke="currentColor"
                strokeWidth="11.5"
                strokeLinecap="square"
            />
        </svg>
    );
};

export default CrossIcon;