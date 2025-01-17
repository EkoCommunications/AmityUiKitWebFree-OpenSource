import React from 'react';

export const Pin = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.4975 13.2955C16.8703 15.3091 16.3483 17.3227 14.9313 18.7397C14.5833 19.0877 14.0613 19.0629 13.7381 18.7397L10.1584 15.16L7.573 17.7453C7.54814 17.7702 7.49842 17.7702 7.47356 17.7951L5.88257 18.5906C5.65884 18.7149 5.38539 18.4414 5.50968 18.2177L6.30518 16.6267C6.33004 16.6018 6.3549 16.577 6.37976 16.5521L8.96512 13.9667L5.38539 10.387C5.03736 10.039 5.03736 9.5418 5.38539 9.19377C6.80236 7.7768 8.7911 7.22989 10.8047 7.60278L12.0228 6.68299L11.3516 6.01179C11.0036 5.66376 11.0036 5.16658 11.3516 4.81855L13.7381 2.43207C14.0613 2.1089 14.5833 2.08404 14.9313 2.43207L21.693 9.19377C22.0162 9.51694 22.0162 10.0638 21.693 10.387L19.3066 12.7735C18.9585 13.1215 18.4365 13.0967 18.1133 12.7735L17.4173 12.0774L16.4975 13.2955ZM7.22497 9.84011L14.2601 16.8753C15.0059 15.7317 15.1053 14.2402 14.6579 12.9475L17.2681 9.5418L18.7099 10.9836L19.9032 9.79039L14.3347 4.22193L13.1415 5.41517L14.5833 6.85701L11.1776 9.46722C9.86005 8.9949 8.3685 9.09434 7.22497 9.84011Z"
        fill="currentColor"
      />
    </svg>
  );
};
