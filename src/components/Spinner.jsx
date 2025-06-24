import React from "react";

const Spinner = ({ size = 48, color = "#6366f1" }) => (
  <div className="flex items-center justify-center">
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        fill="none"
        opacity="0.2"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="15.7"
        fill="none"
      />
    </svg>
  </div>
);

export default Spinner; 