import React from 'react';

const InfoIcon = ({
                      size = 240,
                      radius = 24,
                      color = "currentColor",
                      strokeWidth = 14,
                      className
                  }) => {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect
                x="28"
                y="28"
                width="184"
                height="184"
                rx={radius}
                ry={radius}
                stroke={color}
                strokeWidth={strokeWidth}
            />

            <circle
                cx="120"
                cy="78"
                r="14"
                fill={color}
            />

            <path
                d="
                    M96 101
                    H128
                    V167
                    H142
                    V185
                    H96
                    V167
                    H110
                    V119
                    H96
                    Z
                "
                fill={color}
            />
        </svg>

    );
};

export default InfoIcon;