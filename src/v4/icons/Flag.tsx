import React from 'react';

const FlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.8125 6.0625C16.043 6.0625 17.3789 5.64062 18.6445 5.07812C19.7344 4.62109 21 5.42969 21 6.625V15.0625C21 15.6602 20.6836 16.1875 20.2266 16.5039C19.2773 17.1016 17.7656 17.875 15.6914 17.875C13.3008 17.875 11.7188 16.75 9.99609 16.75C8.02734 16.75 6.83203 17.1719 5.53125 17.7695V20.6875C5.53125 21.0039 5.25 21.25 4.96875 21.25H4.40625C4.08984 21.25 3.84375 21.0039 3.84375 20.6875V6.41406C3.31641 6.13281 3 5.57031 3 4.9375C3 3.98828 3.80859 3.21484 4.79297 3.28516C5.60156 3.32031 6.26953 3.95312 6.33984 4.76172C6.33984 4.83203 6.33984 4.90234 6.33984 4.9375C6.33984 5.14844 6.33984 5.32422 6.26953 5.5C7.04297 5.18359 7.99219 4.9375 9.11719 4.9375C11.5078 4.9375 13.0898 6.0625 14.8125 6.0625ZM19.3125 15.0625V6.625C18.1875 7.15234 16.3242 7.75 14.8125 7.75C12.7031 7.75 11.2266 6.625 9.11719 6.625C7.64062 6.625 6.26953 7.22266 5.53125 7.75V15.9062C6.62109 15.4141 8.48438 15.0625 9.99609 15.0625C12.1055 15.0625 13.582 16.1875 15.6914 16.1875C17.168 16.1875 18.5391 15.625 19.3125 15.0625Z"
      fill="currentColor"
    />
  </svg>
);

export default FlagIcon;
