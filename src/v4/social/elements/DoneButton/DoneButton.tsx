import React from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './DoneButton.module.css';
import clsx from 'clsx';

export interface DoneButtonProps extends React.ComponentProps<typeof Button> {
  pageId?: string;
  componentId?: string;
  className?: string;
}

export function DoneButton({
  pageId = '*',
  componentId = '*',
  className,

  ...buttonProps
}: DoneButtonProps) {
  const elementId = 'done_button';
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      className={clsx(styles.doneButton, className)}
      data-qa-anchor={accessibilityId}
      {...buttonProps}
    >
      <Typography.Body>{config.done_button_text}</Typography.Body>
    </Button>
  );
}
