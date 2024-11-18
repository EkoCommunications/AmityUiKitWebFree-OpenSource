import React from 'react';
import styles from './CommunityPrivacyPublicDescription.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

type CommunityPrivacyPublicDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const CommunityPrivacyPublicDescription = ({
  pageId = '*',
  componentId = '*',
}: CommunityPrivacyPublicDescriptionProps) => {
  const elementId = 'community_privacy_public_description';
  const { isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.Body
      className={styles.communityPrivacyPublicDescription__text}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Body>
  );
};
