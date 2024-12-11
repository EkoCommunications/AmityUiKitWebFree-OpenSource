import React from 'react';

export const Lock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    width="100%"
    height="100%"
    viewBox="0 0 61 61"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M33.0312 44.25C33.0312 45.7266 31.8711 46.7812 30.5 46.7812C29.0234 46.7812 27.9688 45.7266 27.9688 44.25V37.5C27.9688 36.1289 29.0234 34.9688 30.5 34.9688C31.8711 34.9688 33.0312 36.1289 33.0312 37.5V44.25ZM30.5 3.75C37.8828 3.75 44 9.86719 44 17.25V24H47.375C51.0664 24 54.125 27.0586 54.125 30.75V51C54.125 54.7969 51.0664 57.75 47.375 57.75H13.625C9.82812 57.75 6.875 54.7969 6.875 51V30.75C6.875 27.0586 9.82812 24 13.625 24H17V17.25C17 9.86719 23.0117 3.75 30.5 3.75ZM30.5 8.8125C25.7539 8.8125 22.0625 12.6094 22.0625 17.25V24H38.9375V17.25C38.9375 12.6094 35.1406 8.8125 30.5 8.8125ZM13.625 29.0625C12.6758 29.0625 11.9375 29.9062 11.9375 30.75V51C11.9375 51.9492 12.6758 52.6875 13.625 52.6875H47.375C48.2188 52.6875 49.0625 51.9492 49.0625 51V30.75C49.0625 29.9062 48.2188 29.0625 47.375 29.0625H13.625Z" />
  </svg>
);

export default Lock;
