import React from 'react';

const BlockedUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M23.0391 19.8086C23.25 20.0195 23.3203 20.3711 23.1094 20.6172L22.7578 21.0391C22.582 21.2852 22.1953 21.3203 21.9844 21.1445L0.960938 4.69141C0.714844 4.51562 0.679688 4.16406 0.855469 3.91797L1.20703 3.46094C1.41797 3.25 1.76953 3.17969 2.01562 3.39062L23.0391 19.8086ZM12 4.9375C10.6992 4.9375 9.60938 5.67578 9.01172 6.73047L7.67578 5.67578C8.58984 4.23438 10.1719 3.25 12 3.25C14.7773 3.25 17.0625 5.53516 17.0625 8.3125C17.0625 9.71875 16.5 10.9492 15.5859 11.8633L14.25 10.8086C14.918 10.2109 15.375 9.33203 15.375 8.3125C15.375 6.48438 13.8281 4.9375 12 4.9375ZM5.8125 19.5625H17.2383L19.0664 21.0039C18.7852 21.1797 18.5039 21.25 18.1875 21.25H5.8125C4.86328 21.25 4.125 20.5117 4.125 19.5625V18.6836C4.125 16.082 6.23438 13.9375 8.83594 13.9727C9.22266 13.9727 9.60938 14.043 9.96094 14.1836C10.1367 14.2188 10.3125 14.2539 10.4883 14.3242L12.8086 16.1172C12.5273 16.1523 12.2812 16.1875 12 16.1875C11.1211 16.1875 10.2422 16.0469 9.39844 15.7656C9.15234 15.6953 8.97656 15.625 8.83594 15.625C7.14844 15.625 5.8125 16.9961 5.8125 18.6836V19.5625Z"
      fill="currentColor"
    />
  </svg>
);

export default BlockedUser;
