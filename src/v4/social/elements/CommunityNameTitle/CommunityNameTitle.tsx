import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityNameTitleProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityNameTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityNameTitleProps) => {
  const elementId = 'community_name_title';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Title style={themeStyles} data-qa-anchor={accessibilityId}>
      {config.text}
    </Typography.Title>
  );
};
