import React, { FC } from 'react';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import BlockedUser from '~/v4/icons/BlockedUser';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import useUserReport from '~/v4/social/hooks/useUserReport';
import useUserReportedByMe from '~/v4/social/hooks/useUserReportedByMe';
import Flag from '~/v4/social/icons/flag';
import styles from './UserItem.module.css';

type UserItemMenuProps = {
  pageId?: string;
  componentId?: string;
  user: Amity.User;
  closePopover: () => void;
};

export const UserItemMenu: FC<UserItemMenuProps> = ({
  pageId = '*',
  componentId = '*',
  user,
  closePopover,
}) => {
  const { reportUser, unReportUser } = useUserReport();
  const { blockUser } = useUserBlock();
  const { removeDrawerData } = useDrawer();
  const { isReportedByMe } = useUserReportedByMe(user.userId);

  return (
    <div className={styles.userItem__menuContainer}>
      <>
        <Button
          data-qa-anchor={`${pageId}/${componentId}/report_user_button`}
          className={styles.userItem__menuButton}
          onPress={() => {
            closePopover();
            removeDrawerData();
            if (isReportedByMe) unReportUser(user.userId);
            else reportUser(user.userId);
          }}
          variant="text"
        >
          <Flag className={styles.userItem__menuButton__icon} />
          <Typography.BodyBold className={styles.userItem__menuButton__label}>
            {isReportedByMe ? 'Unreport user' : 'Report user'}
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
              userId: user.userId,
              componentId,
              displayName: user.displayName ?? '',
            });
          }}
          variant="text"
        >
          <BlockedUser className={styles.userItem__menuButton__icon} />
          <Typography.BodyBold className={styles.userItem__menuButton__label}>
            Block user
          </Typography.BodyBold>
        </Button>
      </>
    </div>
  );
};
