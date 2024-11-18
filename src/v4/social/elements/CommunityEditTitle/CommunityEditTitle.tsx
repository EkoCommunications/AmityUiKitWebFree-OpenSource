import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityEditTitleProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityEditTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityEditTitleProps) => {
  const elementId = 'community_edit_title';
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
