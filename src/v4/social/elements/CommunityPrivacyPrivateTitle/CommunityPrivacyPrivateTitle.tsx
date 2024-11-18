import React from 'react';
import styles from './CommunityPrivacyPrivateTitle.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components/Typography';

type CommunityPrivacyPrivateTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const CommunityPrivacyPrivateTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityPrivacyPrivateTitleProps) => {
  const elementId = 'community_privacy_private_title';
  const { isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.Title
      className={styles.communityPrivacyPrivateTitle__text}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Title>
  );
};
