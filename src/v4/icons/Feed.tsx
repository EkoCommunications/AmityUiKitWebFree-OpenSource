import React from 'react';

export const Feed = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 25 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.219 14.5c-.492 0-.844-.352-.844-.844 0-.457.352-.844.844-.844h7.312c.457 0 .844.387.844.844a.833.833 0 01-.844.844H9.22zm0 3.375c-.492 0-.844-.352-.844-.844 0-.457.352-.843.844-.843h3.937c.457 0 .844.386.844.843a.833.833 0 01-.844.844H9.22zm0-6.75c-.492 0-.844-.352-.844-.844 0-.457.352-.844.844-.844h7.312c.457 0 .844.387.844.844a.833.833 0 01-.844.844H9.22zM18.5 3.25c1.23 0 2.25 1.02 2.25 2.25V19c0 1.266-1.02 2.25-2.25 2.25H7.25A2.221 2.221 0 015 19V5.5c0-1.23.984-2.25 2.25-2.25H18.5zM19.063 19V7.75H6.688V19c0 .316.246.563.562.563H18.5a.578.578 0 00.563-.563z"
      ></path>
    </svg>
  );
};
