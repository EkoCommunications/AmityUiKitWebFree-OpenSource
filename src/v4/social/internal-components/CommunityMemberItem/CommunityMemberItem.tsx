import React from 'react';
import styles from './CommunityMemberItem.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { MenuButton } from '~/v4/social/elements/MenuButton/MenuButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Button } from '~/v4/core/natives/Button/Button';
import { PromoteToModerator } from '~/v4/icons/PromoteToModerator';
import { DemoteToMember } from '~/v4/icons/DemoteToMember';
import useModerator from '~/v4/social/hooks/useModerator';
import useUserFlaggedByMe from '~/v4/social/hooks/useUserFlaggedByMe';
import { MemberRoles } from '~/v4/social/constants/memberRoles';
import { isModerator } from '~/v4/utils/permissions';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import UnFlag from '~/v4/icons/UnFlag';
import Flag from '~/v4/icons/Flag';
import { isNonNullable } from '~/v4/helpers/utils';
import { IconComponent } from '~/v4/core/IconComponent';
import { Trash } from '~/icons';
import Banned from '~/v4/icons/Banned';
import GoldenBadge from '~/v4/icons/GoldenBadge';

const { COMMUNITY_MODERATOR, CHANNEL_MODERATOR } = MemberRoles;

type CommunityMemberItemProps = {
  pageId?: string;
  user?: Amity.User;
  community?: Amity.Community;
  currentUserId?: string | null;
  roles?: string[];
  onClick?: () => void;
  isModeratorTab?: boolean;
};

export const CommunityMemberItem = ({
  pageId = '*',
  isModeratorTab = false,
  user,
  community,
  currentUserId,
  roles,
  onClick,
}: CommunityMemberItemProps) => {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const notification = useNotifications();
  const { hasModeratorPermissions, assignRolesToUsers, removeRolesFromUsers, removeMembers } =
    useModerator({
      community,
      user,
    });

  const memberHasModeratorRole = isModerator(roles);
  const isGlobalBanned = user?.isGlobalBan;
  const isCurrentUser = currentUserId === user?.userId;

  const { isFlaggedByMe, toggleFlagUser } = useUserFlaggedByMe(currentUserId as string);

  const onReportUser = () => {
    removeDrawerData();
    try {
      toggleFlagUser();
    } catch (err) {
      notification.error({
        content: 'Failed to report member. Please try again.',
      });
    } finally {
      notification.success({
        content: isFlaggedByMe ? 'User unreported.' : 'User reported.',
      });
    }
  };

  const onPromoteModeratorClick = async () => {
    removeDrawerData();
    try {
      assignRolesToUsers([COMMUNITY_MODERATOR, CHANNEL_MODERATOR], [user?.userId as string]);
    } catch (err) {
      notification.error({
        content: 'Failed to promote member. Please try again.',
      });
    } finally {
      notification.success({
        content: 'Successfully promoted to moderator!',
      });
    }
  };

  const onDismissModeratorClick = async () => {
    removeDrawerData();
    try {
      removeRolesFromUsers([COMMUNITY_MODERATOR, CHANNEL_MODERATOR], [user?.userId as string]);
    } catch (err) {
      notification.error({
        content: 'Failed to demote member. Please try again.',
      });
    } finally {
      notification.success({
        content: 'Successfully demoted to member!',
      });
    }
  };

  const onRemoveFromCommunityClick = () => {
    removeDrawerData();
    try {
      user?.userId && removeMembers([user.userId]);
    } catch (err) {
      notification.error({
        content: 'Failed to remove member. Please try again.',
      });
    } finally {
      notification.success({
        content: 'Member removed from this community.',
      });
    }
  };

  const options = [
    hasModeratorPermissions && !memberHasModeratorRole && !isGlobalBanned
      ? {
          name: 'Promote to moderator',
          action: onPromoteModeratorClick,
          icon: <PromoteToModerator className={styles.communityMemberItem__bottomSheeticon} />,
          accessibilityId: 'promote_moderator',
        }
      : null,

    hasModeratorPermissions && memberHasModeratorRole
      ? {
          name: 'Demote to member',
          action: onDismissModeratorClick,
          icon: <DemoteToMember className={styles.communityMemberItem__bottomSheeticon} />,
          accessibilityId: 'demote_member',
        }
      : null,

    {
      name: isFlaggedByMe ? 'Unreport user' : 'Report user',
      action: onReportUser,
      icon: isFlaggedByMe ? (
        <UnFlag className={styles.communityMemberItem__bottomSheeticon} />
      ) : (
        <Flag className={styles.communityMemberItem__bottomSheeticon} />
      ),
      accessibilityId: 'report_member',
    },
    hasModeratorPermissions
      ? {
          name: 'Remove from community',
          action: onRemoveFromCommunityClick,
          className: styles.communityMemberItem__alertText,
          icon: <Trash className={styles.communityMemberItem__alertbottomSheeticon} />,
          accessibilityId: 'remove_member',
        }
      : null,
  ].filter(isNonNullable);

  return (
    <div className={styles.communityMemberItem__items} key={user?.userId}>
      <Button onPress={onClick} className={styles.communityMemberItem__leftSide}>
        <div className={styles.communityMemberItem__memberAvatar}>
          <UserAvatar userId={user?.userId} isShowModeratorBadge={memberHasModeratorRole} />
        </div>
        <Typography.BodyBold className={styles.communityMemberItem__memberName}>
          {user?.displayName}
        </Typography.BodyBold>
        {user?.isBrand && (
          <IconComponent
            defaultIcon={() => <GoldenBadge className={styles.communityMemberItem__badge} />}
            imgIcon={() => <GoldenBadge className={styles.communityMemberItem__badge} />}
            defaultIconName="badge icon"
          />
        )}
        {isGlobalBanned && (
          <IconComponent
            defaultIcon={() => <Banned className={styles.communityMemberItem__bannedIcon} />}
            imgIcon={() => <Banned className={styles.communityMemberItem__bannedIcon} />}
            defaultIconName="banned icon"
          />
        )}
      </Button>
      {!isCurrentUser && community?.isJoined && (
        <MenuButton
          pageId={pageId}
          onClick={() =>
            setDrawerData({
              content: (
                <div className={styles.communityMemberItem__menuWrapper}>
                  {options.map((option) => (
                    <Button onPress={option.action} className={styles.communityMemberItem__menu}>
                      <IconComponent
                        defaultIcon={() => option.icon}
                        imgIcon={() => option.icon}
                        defaultIconName={option.accessibilityId}
                      />
                      <Typography.BodyBold className={option.className ?? ''}>
                        {option.name}
                      </Typography.BodyBold>
                    </Button>
                  ))}
                </div>
              ),
            })
          }
        />
      )}
    </div>
  );
};
