import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './CommunityOfficialBadge.module.css';

const OfficialBadgeIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M9.37994 13.8338L9.38127 13.8325L10.1112 13.1025H11.1457C11.7097 13.1025 12.2263 12.9686 12.5968 12.5981C12.9673 12.2276 13.1012 11.711 13.1012 11.147V10.1122L13.8299 9.37868C13.8303 9.37826 13.8307 9.37784 13.8311 9.37743C14.2311 8.98007 14.501 8.52092 14.5 7.99773C14.499 7.47504 14.2277 7.01654 13.8312 6.62004L13.1012 5.89006V4.85556C13.1012 4.29165 12.9673 3.77501 12.5968 3.40452C12.2263 3.03403 11.7097 2.90007 11.1457 2.90007H10.1112L9.38127 2.17009C8.98227 1.77109 8.52172 1.499 7.99708 1.5C7.47281 1.50101 7.01425 1.77445 6.61805 2.17598L5.8891 2.90007H4.85426C4.29311 2.90007 3.77575 3.03008 3.40418 3.39965C3.03208 3.76972 2.89876 4.28782 2.89876 4.85556V5.89006L2.17011 6.61871C2.16988 6.61894 2.16965 6.61917 2.16942 6.6194C1.76917 7.01688 1.499 7.47622 1.5 7.99966C1.50101 8.52208 1.77199 8.98037 2.16815 9.37673C2.16836 9.37694 2.16857 9.37715 2.16878 9.37735L2.89876 10.1122V11.147C2.89876 11.711 3.03273 12.2276 3.40321 12.5981C3.7737 12.9686 4.29035 13.1025 4.85426 13.1025H5.88875L6.61741 13.8312C6.61768 13.8315 6.61794 13.8317 6.61821 13.832C7.01578 14.2323 7.47508 14.5023 7.999 14.5013C8.52172 14.5003 8.98117 14.2296 9.37994 13.8338ZM10.1639 13.0499C10.1639 13.0499 10.1639 13.0499 10.1638 13.05C10.1639 13.0499 10.1639 13.0499 10.1639 13.0499Z"
      stroke="white"
    />
    <path
      d="M6.69076 10.4846C6.80553 10.6045 6.9516 10.6724 7.13419 10.6724C7.32722 10.6724 7.48372 10.6045 7.60371 10.448L10.5303 6.3424C10.6086 6.23285 10.6503 6.10243 10.6503 5.99809C10.6503 5.69551 10.4208 5.47119 10.0973 5.47119C9.88868 5.47119 9.75304 5.54423 9.62783 5.7216L7.11333 9.31077L5.85607 7.90745C5.7413 7.78224 5.61088 7.72486 5.43351 7.72486C5.11007 7.72486 4.88574 7.94918 4.88574 8.26219C4.88574 8.39261 4.93269 8.52303 5.02138 8.61694L6.69076 10.4846Z"
      fill="white"
    />
  </svg>
);

export interface CommunityOfficialBadgeProps {
  pageId?: string;
  className?: string;
  componentId?: string;
}

export function CommunityOfficialBadge({
  className,
  pageId = '*',
  componentId = '*',
}: CommunityOfficialBadgeProps) {
  const elementId = 'community_official_badge';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <IconComponent
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
      defaultIcon={() => (
        <OfficialBadgeIconSvg
          style={themeStyles}
          data-qa-anchor={accessibilityId}
          className={clsx(styles.communityOfficialBadge, className)}
        />
      )}
      imgIcon={() => (
        <img
          alt={uiReference}
          src={config.icon}
          data-qa-anchor={accessibilityId}
          className={styles.communityOfficialBadge}
        />
      )}
    />
  );
}
