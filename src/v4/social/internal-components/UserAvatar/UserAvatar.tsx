import clsx from 'clsx';
import React from 'react';
import Badge from '~/v4/icons/Badge';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import styles from './UserAvatar.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type UserAvatarProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
  userId?: string | null;
  isShowModeratorBadge?: boolean;
  imageContainerClassName?: string;
  textPlaceholderClassName?: string;
};

export function UserAvatar({
  userId,
  className,
  pageId = '*',
  componentId = '*',
  imageContainerClassName,
  isShowModeratorBadge = false,
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

  const { onClickUser } = useNavigation();

  if (user == null || userId == null || userImage == null) {
    return (
      <div
        className={clsx(styles.userAvatar__placeholder, className)}
        onClick={() => {
          if (userId != null) {
            onClickUser(userId);
          }
        }}
      >
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
    <span className={clsx(styles.userAvatar__container, imageContainerClassName)}>
      <object
        type="image/png"
        data={userImage}
        data-qa-anchor={accessibilityId}
        className={clsx(styles.userAvatar__img, className)}
        onClick={() => onClickUser(userId)}
      />
      {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
    </span>
  );
}
