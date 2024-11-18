import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useImage } from '~/v4/core/hooks/useImage';
import Badge from '~/v4/icons/Badge';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  pageId?: string;
  componentId?: string;
  userId?: string | null;
  className?: string;
  textPlaceholderClassName?: string;
  isShowModeratorBadge?: boolean;
}

export function UserAvatar({
  pageId = '*',
  componentId = '*',
  isShowModeratorBadge = false,
  userId,
  className,
  textPlaceholderClassName = '',
}: UserAvatarProps) {
  const elementId = 'user_avatar';
  const { accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  const { user } = useUser({ userId });

  const userImage = useImage({ fileId: user?.avatar?.fileId });

  const displayName = user?.displayName || user?.userId || '';
  const firstChar = displayName?.trim().charAt(0).toUpperCase();

  if (user == null || userId == null || userImage == null) {
    return (
      <div className={clsx(styles.userAvatar__placeholder, className)}>
        <Typography.Title
          className={clsx(styles.userAvatar__placeholder__text, textPlaceholderClassName)}
        >
          {firstChar}
        </Typography.Title>
        {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
      </div>
    );
  }

  return (
    <span className={styles.userAvatar__container}>
      <object
        data-qa-anchor={accessibilityId}
        data={userImage}
        type="image/png"
        className={clsx(styles.userAvatar__img, className)}
      />
      {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
    </span>
  );
}
