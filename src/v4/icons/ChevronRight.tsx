import React from 'react';

const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    width="100%"
    height="100%"
    viewBox="0 0 25 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8.84375 4.62109C9.01953 4.44531 9.26562 4.44531 9.44141 4.62109L16.8242 11.9688C16.9648 12.1445 16.9648 12.3906 16.8242 12.5664L9.44141 19.9141C9.26562 20.0898 9.01953 20.0898 8.84375 19.9141L8.14062 19.2461C8 19.0703 8 18.7891 8.14062 18.6484L14.5039 12.25L8.14062 5.88672C8 5.74609 8 5.46484 8.14062 5.28906L8.84375 4.62109Z" />
  </svg>
);

export default ChevronRight;
