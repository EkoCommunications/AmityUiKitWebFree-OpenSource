import React, { useEffect, useState } from 'react';
import styles from './MemberList.module.css';
import { Search } from '~/v4/icons/Search';
import { Input } from 'react-aria-components';
import { Button } from '~/v4/core/natives/Button/Button';
import { Clear } from '~/v4/icons/Clear';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { CommunityMemberItem } from '~/v4/social/internal-components/CommunityMemberItem';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

type MemberListProps = {
  pageId?: string;
  community: Amity.Community;
};

export const UserListSkeleton = () => {
  return (
    <div className={styles.memberList__userSkeleton}>
      <div className={styles.memberList__userSkeletonHeader}>
        <div className={styles.memberList__userSkeletonAvatar}></div>
        <div className={styles.memberList__userSkeletonUserInfo}>
          <div className={styles.memberList__userSkeletonUsername}></div>
          <div className={styles.memberList__userSkeletonSubtitle}></div>
        </div>
      </div>
    </div>
  );
};

export const MemberList = ({ pageId = '*', community }: MemberListProps) => {
  const componentId = 'member_list';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { onClickUser } = useNavigation();

  const { currentUserId } = useSDK();
  const [memberSearch, setMemberSearch] = useState('');
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { members, hasMore, isLoading, loadMore, refresh } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
      memberships: ['member'],
    },
    shouldCall: !!community?.communityId,
  });

  const {
    members: memberSearchResults,
    hasMore: hasMoreSearch,
    isLoading: isSearchLoading,
    loadMore: loadMoreSearch,
  } = useMemberQueryByDisplayName({
    communityId: community.communityId || '',
    displayName: memberSearch || '',
    limit: 10,
    enabled: !!community.communityId,
  });

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberSearch(e.target.value);
  };

  useIntersectionObserver({
    onIntersect: () => {
      if (memberSearch.length === 0 && hasMore && isLoading === false) {
        loadMore();
      }
      if (memberSearch.length > 0 && hasMoreSearch && isSearchLoading === false) {
        loadMoreSearch();
      }
    },
    node: intersectionNode,
  });

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId}>
      <div className={styles.memberList__searchWrap}>
        <Search
          data-search-value={memberSearch.length > 0}
          className={styles.memberList__searchIcon}
        />
        <Input
          data-qa-anchor={`${accessibilityId}_search_input`}
          className={styles.memberList__searchInput}
          type="text"
          placeholder="Search user"
          value={memberSearch}
          onChange={(e) => handleSearchUser(e)}
        />
        <Button
          data-qa-anchor={`${accessibilityId}_add_member_button`}
          aria-label="Close"
          data-search-value={memberSearch.length > 0}
          onPress={() => setMemberSearch('')}
          className={styles.memberList__clearSearchButton}
        >
          <Clear className={styles.memberList__clearSearch} />
        </Button>
      </div>

      {(memberSearch.length > 0 && !isSearchLoading
        ? memberSearchResults
        : memberSearch.length == 0 && !isLoading
          ? members
          : []
      ).map(({ user, roles }) => (
        <CommunityMemberItem
          pageId={pageId}
          user={user}
          roles={roles}
          community={community}
          currentUserId={currentUserId}
          onClick={() => onClickUser(user?.userId as string)}
        />
      ))}
      {(isLoading && memberSearch.length == 0) || (isSearchLoading && memberSearch.length > 0)
        ? Array.from({ length: 5 }).map((_, index) => <UserListSkeleton key={index} />)
        : null}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
