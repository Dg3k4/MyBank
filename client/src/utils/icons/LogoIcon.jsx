import React from 'react';

const LogoIcon = ({className}) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="240"
            height="240"
            viewBox="0 0 240 240"
            fill="none"
        >
            <defs>
                <mask
                    id="logo-cutout"
                    maskUnits="userSpaceOnUse"
                    x="40"
                    y="40"
                    width="160"
                    height="160"
                >
                    <circle
                        cx="120"
                        cy="120"
                        r="80"
                        fill="white"
                    />

                    <path d="M98 26
                    C83 62 83 95 103 121
                    C116 137 134 147 154 152
                    C170 155 184 144 186 127
                    C188 107 177 90 159 83
                    C140 76 121 85 112 102
                    C100 124 109 149 127 167
                    C142 182 162 188 184 187
                "
                        fill="none"
                        stroke="black"
                        strokeWidth="11"
                        strokeLinecap="butt"
                    />
                </mask>
            </defs>

            <circle
                cx="120"
                cy="120"
                r="80"
                mask="url(#logo-cutout)"
            />
        </svg>
    );
};

export default LogoIcon;