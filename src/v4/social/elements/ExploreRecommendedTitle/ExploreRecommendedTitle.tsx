import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import styles from './ExploreRecommendedTitle.module.css';

interface TitleProps {
  pageId?: string;
  componentId?: string;
  titleClassName?: string;
}

export function ExploreRecommendedTitle({
  pageId = '*',
  componentId = '*',
  titleClassName,
}: TitleProps) {
  const elementId = 'explore_recommended_title';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      className={clsx(styles.exploreRecommendedTitle, titleClassName)}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.TitleBold>
  );
}
