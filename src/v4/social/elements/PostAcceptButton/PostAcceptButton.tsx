import React from 'react';
import styles from './PostAcceptButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';

export interface PostAcceptButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export const PostAcceptButton = ({
  pageId = '*',
  componentId = '*',
  onClick,
}: PostAcceptButtonProps) => {
  const elementId = 'post_accept_button';

  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button onPress={onClick} className={styles.postAcceptButton__button}>
      <Typography.BodyBold
        data-qa-anchor={accessibilityId}
        style={themeStyles}
        className={styles.postAcceptButton__text}
      >
        {config?.text}
      </Typography.BodyBold>
    </Button>
  );
};
