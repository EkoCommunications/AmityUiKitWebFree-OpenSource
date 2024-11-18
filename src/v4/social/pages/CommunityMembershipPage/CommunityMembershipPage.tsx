import React, { useState } from 'react';
import styles from './CommunityMembershipPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components/Typography';
import { Plus } from '~/v4/icons/Plus';
import { Button } from '~/v4/core/natives/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { MemberTab } from '~/v4/social/internal-components/MemberTab/MemberTab';
import { MemberList } from '~/v4/social/internal-components/MemberList';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ModeratorList } from '~/v4/social/internal-components/ModeratorList';
import { useSDK } from '~/v4/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import useModerator from '~/v4/social/hooks/useModerator';

type CommunityMembershipPageProps = {
  community: Amity.Community;
};

export const CommunityMembershipPage = ({ community }: CommunityMembershipPageProps) => {
  const pageId = 'community_membership_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const [activeTab, setActiveTab] = useState<'members' | 'moderators'>('members');
  const { members } = useCommunitySetupContext();
  const { onBack } = useNavigation();
  const { AmityCommunityMembershipPage } = usePageBehavior();
  const notification = useNotifications();
  const { currentUserId } = useSDK();
  const user = useUser(currentUserId);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <MemberList pageId={pageId} community={community} />;
      case 'moderators':
        return <ModeratorList pageId={pageId} community={community} />;

      default:
        return null;
    }
  };

  const handleTabChange = (tab: 'members' | 'moderators') => {
    setActiveTab(tab);
  };

  const { hasModeratorPermissions } = useModerator({
    community,
    user,
  });

  const onClickAddMember = async (
    userIds: Parameters<typeof CommunityRepository.Membership.addMembers>[1],
  ) => {
    if (community.communityId == null) return;
    if (!community.isJoined || !hasModeratorPermissions) {
      return notification.error({
        content: 'Failed to add members to this community',
      });
    }
    try {
      await CommunityRepository.Membership.addMembers(community.communityId, userIds);
    } catch (err) {
      notification.error({
        content: 'Failed to add members to this community. Please try again.',
      });
    } finally {
      notification.success({
        content: 'Successfully added members to this community!',
      });
    }
  };

  return (
    <div style={themeStyles} data-qa-anhor={accessibilityId}>
      <div className={styles.communityMembershipPage__topBar}>
        <BackButton onPress={onBack} />
        <Typography.Title className={styles.communityMembershipPage__title}>
          All members
        </Typography.Title>
        <Button
          onPress={() => {
            AmityCommunityMembershipPage?.goToAddMemberPage?.({
              members,
              communityId: community.communityId,
              onAddedAction: onClickAddMember,
            });
          }}
        >
          <Plus className={styles.communityMembershipPage__plusIcon} />
        </Button>
      </div>
      <MemberTab pageId={pageId} activeTab={activeTab} onTabChange={handleTabChange} />
      <div>{renderTabContent()}</div>
    </div>
  );
};
