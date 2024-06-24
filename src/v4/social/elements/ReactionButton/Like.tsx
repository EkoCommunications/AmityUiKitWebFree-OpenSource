import React from 'react';

const Like = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="url(#paint0_linear_1709_1733)" />
    <path
      d="M10.7752 12.1C11.2221 12.1 11.6002 12.4782 11.6002 12.925V21.175C11.6002 21.6563 11.2221 22 10.7752 22H8.0252C7.54395 22 7.2002 21.6563 7.2002 21.175V12.925C7.2002 12.4782 7.54395 12.1 8.0252 12.1H10.7752ZM9.4002 20.625C9.84707 20.625 10.2252 20.2813 10.2252 19.8C10.2252 19.3532 9.84707 18.975 9.4002 18.975C8.91895 18.975 8.5752 19.3532 8.5752 19.8C8.5752 20.2813 8.91895 20.625 9.4002 20.625ZM20.4002 7.2188C20.4002 8.66255 19.5064 9.48755 19.2314 10.45H22.7377C23.8721 10.45 24.7658 11.4125 24.7658 12.4782C24.8002 13.0969 24.5252 13.75 24.1127 14.1625C24.4564 14.9532 24.3877 16.0875 23.8033 16.8782C24.0783 17.7719 23.8033 18.8719 23.2189 19.4563C23.3908 20.075 23.3221 20.5907 23.0127 21.0032C22.3252 22 20.5721 22 19.0939 22H18.9908C17.3408 22 16.0002 21.4157 14.9002 20.9344C14.3502 20.6938 13.6283 20.3844 13.0783 20.3844C12.8721 20.35 12.7002 20.1782 12.7002 19.9719V12.6157C12.7002 12.5125 12.7346 12.4094 12.8033 12.3063C14.1783 10.9657 14.7627 9.5563 15.8627 8.42192C16.3783 7.9063 16.5502 7.15005 16.7564 6.3938C16.8939 5.77505 17.2033 4.40005 17.9252 4.40005C18.7502 4.40005 20.4002 4.67505 20.4002 7.2188Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1709_1733"
        x1="12"
        y1="3.2"
        x2="26.4"
        y2="39.2"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#63A1FF" />
        <stop offset="1" stop-color="#0041BE" />
      </linearGradient>
    </defs>
  </svg>
);

export default Like;
