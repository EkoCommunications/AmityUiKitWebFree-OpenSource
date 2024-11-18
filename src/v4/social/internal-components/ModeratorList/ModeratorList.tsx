import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { CommunityMemberItem } from '~/v4/social/internal-components/CommunityMemberItem';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UserListSkeleton } from '~/v4/social/internal-components/MemberList/MemberList';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

type ModeratorListProps = {
  pageId?: string;
  community: Amity.Community;
};

export const ModeratorList = ({ pageId = '*', community }: ModeratorListProps) => {
  const componentId = 'moderator_list';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { onEditCommunity } = useNavigation();
  const { currentUserId } = useSDK();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { moderators, hasMore, isLoading, loadMore, refresh } = useCommunityModeratorsCollection({
    communityId: community?.communityId as string,
    shouldCall: !!community?.communityId,
  });

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
  });

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId}>
      {!isLoading &&
        moderators.length > 0 &&
        moderators.map(({ user, roles }) => (
          <CommunityMemberItem
            pageId={pageId}
            user={user}
            community={community}
            currentUserId={currentUserId}
            roles={roles}
            onClick={() => onEditCommunity(community.communityId, 'MEMBERS')}
            isModeratorTab
          />
        ))}
      {isLoading && Array.from({ length: 5 }).map((_, index) => <UserListSkeleton key={index} />)}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
