import React from 'react';
import styles from './PostDeclineButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';

export interface PostDeclineButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export const PostDeclineButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
}: PostDeclineButtonProps) => {
  const elementId = 'post_decline_button';

  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button onPress={onClick} className={styles.postDeclineButton__button}>
      <Typography.BodyBold
        data-qa-anchor={accessibilityId}
        style={themeStyles}
        className={styles.postDeclineButton__text}
      >
        {config?.text}
      </Typography.BodyBold>
    </Button>
  );
};
