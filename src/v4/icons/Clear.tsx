import React from 'react';

// Todo: same icon but different names
export function ClearIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      width="100%"
      height="100%"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8.82715 17.3906C13.4238 17.3906 17.2119 13.5938 17.2119 9.00586C17.2119 4.40918 13.415 0.612305 8.82715 0.612305C4.23047 0.612305 0.442383 4.40918 0.442383 9.00586C0.442383 13.5938 4.23926 17.3906 8.82715 17.3906ZM5.88281 12.5479C5.54883 12.5479 5.28516 12.2842 5.28516 11.9502C5.28516 11.792 5.34668 11.6514 5.46973 11.5283L7.9834 9.01465L5.46973 6.49219C5.34668 6.37793 5.28516 6.22852 5.28516 6.07031C5.28516 5.74512 5.54883 5.49023 5.88281 5.49023C6.0498 5.49023 6.19043 5.54297 6.2959 5.66602L8.82715 8.17969L11.3584 5.65723C11.4902 5.52539 11.6221 5.47266 11.7803 5.47266C12.1055 5.47266 12.3691 5.73633 12.3691 6.06152C12.3691 6.22852 12.3164 6.36035 12.1934 6.4834L9.6709 9.01465L12.1846 11.5283C12.3076 11.6514 12.3691 11.7832 12.3691 11.9502C12.3691 12.2842 12.1055 12.5479 11.7627 12.5479C11.5957 12.5479 11.4551 12.4863 11.332 12.3721L8.82715 9.84961L6.32227 12.3721C6.19922 12.4863 6.0498 12.5479 5.88281 12.5479Z" />
    </svg>
  );
}

export const Clear = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 20 21"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M9.99121 18.8906C5.40332 18.8906 1.60645 15.0938 1.60645 10.5059C1.60645 5.90918 5.39453 2.1123 9.99121 2.1123C14.5791 2.1123 18.376 5.90918 18.376 10.5059C18.376 15.0938 14.5879 18.8906 9.99121 18.8906ZM7.19629 13.9072C7.37207 13.9072 7.5127 13.8457 7.63574 13.7227L9.99121 11.3496L12.3555 13.7227C12.4697 13.8457 12.6279 13.9072 12.7949 13.9072C13.1289 13.9072 13.3926 13.6348 13.3926 13.3096C13.3926 13.1426 13.3398 12.9932 13.2168 12.8789L10.8438 10.5146L13.2168 8.13281C13.3486 8.00098 13.3926 7.86914 13.3926 7.70215C13.3926 7.37695 13.1289 7.12207 12.8037 7.12207C12.6455 7.12207 12.5137 7.1748 12.3818 7.29785L9.99121 9.67969L7.61816 7.30664C7.49512 7.19238 7.37207 7.13086 7.19629 7.13086C6.87109 7.13086 6.60742 7.38574 6.60742 7.71973C6.60742 7.87793 6.66895 8.02734 6.7832 8.1416L9.15625 10.5146L6.7832 12.8877C6.66895 13.002 6.60742 13.1426 6.60742 13.3096C6.60742 13.6348 6.87109 13.9072 7.19629 13.9072Z" />
  </svg>
);
