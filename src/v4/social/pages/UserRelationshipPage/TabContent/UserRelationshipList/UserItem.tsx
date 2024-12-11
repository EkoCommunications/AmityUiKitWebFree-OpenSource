import React, { FC } from 'react';
import styles from './UserItem.module.css';
import Flag from '~/v4/icons/Flag';
import BlockedUser from '~/v4/icons/BlockedUser';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import useUserReportedByMe from '~/v4/social/hooks/useUserReportedByMe';
import useUserReport from '~/v4/social/hooks/useUserReport';
import { Popover } from '~/v4/core/components/AriaPopover';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

type UserItemProps = {
  userId: string;
  pageId?: string;
  componentId?: string;
};

export const UserItem: FC<UserItemProps> = ({ userId, pageId = '*', componentId = '*' }) => {
  const { AmityUserRelationshipPageBehavior } = usePageBehavior();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { isReportedByMe } = useUserReportedByMe(userId);
  const { reportUser, unReportUser } = useUserReport();
  const { blockUser } = useUserBlock();
  const { user } = useUser({ userId });

  if (!user) return null;

  const renderMenu = ({ closePopover }: { closePopover: () => void }) => {
    return (
      <div className={styles.userItem__menuContainer}>
        <Button
          data-qa-anchor={`${pageId}/${componentId}/report_user_button`}
          className={styles.userItem__menuButton}
          onPress={() => {
            closePopover();
            removeDrawerData();
            if (isReportedByMe) unReportUser(userId);
            else reportUser(userId);
          }}
        >
          <Flag className={styles.userItem__menuButton__icon} />
          <Typography.BodyBold className={styles.userItem__menuButton__label}>
            {isReportedByMe ? 'UnReport user' : 'Report user'}
          </Typography.BodyBold>
        </Button>
        <Button
          data-qa-anchor={`${pageId}/${componentId}/block_user_button`}
          className={styles.userItem__menuButton}
          onPress={() => {
            closePopover();
            removeDrawerData();
            blockUser({
              pageId,
              userId,
              componentId,
              displayName: user.displayName ?? '',
            });
          }}
        >
          <BlockedUser className={styles.userItem__menuButton__icon} />
          <Typography.BodyBold className={styles.userItem__menuButton__label}>
            Block user
          </Typography.BodyBold>
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.userItem}>
      <Button
        onPress={() => AmityUserRelationshipPageBehavior.goToUserProfilePage?.({ userId })}
        className={styles.userItem__buttonWrap}
      >
        <UserAvatar
          pageId={pageId}
          componentId={componentId}
          userId={user.userId}
          className={styles.userItem__avatar}
        />

        <Typography.BodyBold className={styles.userItem__displayName}>
          {user.displayName}
        </Typography.BodyBold>
      </Button>
      <Popover
        trigger={{
          pageId,
          componentId,
          onClick: ({ closePopover }) =>
            setDrawerData({
              content: renderMenu({ closePopover }),
            }),
        }}
      >
        {({ closePopover }) => renderMenu({ closePopover })}
      </Popover>
    </div>
  );
};
