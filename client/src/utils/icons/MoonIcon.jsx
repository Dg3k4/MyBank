import React from 'react';

const MoonIcon = ({className}) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="225"
            height="209"
            viewBox="0 0 240 220"
            fill="none"
        >
            <path d="M155.28 35.88
            C129.19 45.75 111.85 70.28 111.85 97.93
            C111.85 133.43 140.63 162.20 176.12 162.20
            C180.51 162.20 184.76 161.76 188.87 160.94
            C174.45 177.65 153.13 188.22 129.36 188.22
            C86.16 188.22 51.14 153.20 51.14 110
            C51.14 66.80 86.16 31.78 129.36 31.78
            C138.33 31.78 147.07 33.28 155.28 35.88Z"
                  stroke="currentColor"
                  strokeWidth="11.5"
            />
        </svg>
    );
};

export default MoonIcon;