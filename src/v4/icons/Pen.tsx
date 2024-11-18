import React from 'react';

export const Pen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill={props.fill}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10.0625 3.9375L14.0625 7.9375L5.375 16.625L1.8125 17C1.34375 17.0625 0.9375 16.6562 1 16.1875L1.375 12.625L10.0625 3.9375ZM16.5312 3.34375C17.125 3.90625 17.125 4.875 16.5312 5.46875L14.7812 7.21875L10.7812 3.21875L12.5312 1.46875C13.125 0.875 14.0938 0.875 14.6562 1.46875L16.5312 3.34375Z" />
  </svg>
);
