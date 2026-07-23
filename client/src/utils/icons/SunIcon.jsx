import React from 'react';

const SunIcon = ({className}) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="240"
            height="240"
            viewBox="0 0 240 220"
            fill="none"
        >
            <circle
                cx="120"
                cy="110"
                r="40.5"
                stroke="currentColor"
                strokeWidth="11.5"
                fill="currentColor"
            />

            <path d="M120 20V50
            M120 170V200
            M30 110H60
            M180 110H210
            M56.36 46.36L77.57 67.57
            M162.43 152.43L183.64 173.64
            M183.64 46.36L162.43 67.57
            M77.57 152.43L56.36 173.64"
                stroke="currentColor"
                strokeWidth="11.5"
            />
        </svg>
    );
};

export default SunIcon;