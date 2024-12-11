import React, { FC } from 'react';
import styles from './BlockedUserItem.module.css';
import { UserListUnblockUserButton } from '~/v4/social/elements/UserListUnblockUserButton';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { Typography } from '~/v4/core/components';
import useUserBlock from '~/v4/social/hooks/useUserBlock';

type BlockedUserItemProps = {
  pageId?: string;
  componentId?: string;
  user: Amity.User;
};

export const BlockedUserItem: FC<BlockedUserItemProps> = ({
  user,
  pageId = '*',
  componentId = '*',
}) => {
  const { unblockUser } = useUserBlock();
  return (
    <div className={styles.blockUserItem}>
      <UserAvatar userId={user.userId} className={styles.blockUserItem__avatar} />
      <Typography.BodyBold className={styles.blockUserItem__displayName}>
        {user.displayName}
      </Typography.BodyBold>
      <UserListUnblockUserButton
        pageId={pageId}
        componentId={componentId}
        onClick={() =>
          unblockUser({
            pageId,
            componentId,
            userId: user.userId,
            displayName: user.displayName ?? user.userId,
          })
        }
      />
    </div>
  );
};
