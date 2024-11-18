import React, { useState } from 'react';
import styles from './CommunityAddMemberPage.module.css';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { Search } from '~/v4/icons/Search';
import { CheckboxGroup, Input } from 'react-aria-components';
import { Button } from '~/v4/core/natives/Button';
import { Clear } from '~/v4/icons/Clear';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { Checkbox as CheckboxIcon } from '~/v4/icons/Checkbox';
import useAllUsersCollection from '~/v4/core/hooks/collections/useAllUsersCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { SearchResultSkeleton } from '~/v4/social/internal-components/SearchResultSkeleton/SearchResultSkeleton';
import { MemberCommunitySetup } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';

interface CommunityAddMemberPageProps {
  member?: MemberCommunitySetup[];
  communityId?: string;
  onAddedAction?: (userId: string[]) => void;
}

export const CommunityAddMemberPage = ({
  member,
  communityId,
  onAddedAction,
}: CommunityAddMemberPageProps) => {
  const pageId = 'community_add_member_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { members, setMembers } = useCommunitySetupContext();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<MemberCommunitySetup[]>(members ?? []);
  const { onBack } = useNavigation();

  const { users, hasMore, loadMore, isLoading } = useAllUsersCollection({
    queryParams: {
      limit: 20,
      sortBy: 'displayName',
    },
    shouldCall: memberSearch.length === 0,
  });
  const {
    users: userSearchResults,
    hasMore: hasMoreSearch,
    loadMore: loadMoreSearch,
    isLoading: isSearchLoading,
  } = useUserQueryByDisplayName({
    displayName: memberSearch,
    limit: 10,
    enabled: memberSearch.length > 0,
  });

  const { members: communityMember } = useCommunityMembersCollection({
    queryParams: { communityId: communityId as string, memberships: ['member'] },
    shouldCall: !!communityId,
  });

  const communityMemberIds = communityMember.map((member) => member.userId);
  const nonMemberUsers = users.filter((user) => !communityMemberIds.includes(user.userId));
  const nonMemberSearchUsers = userSearchResults.filter(
    (user) => !communityMemberIds.includes(user.userId),
  );

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

  const handleSelectMember = (member: MemberCommunitySetup, isChecked: boolean) => {
    if (isChecked) {
      setSelectedMembers([...selectedMembers, member]);
    } else {
      setSelectedMembers(selectedMembers.filter((c) => c.userId !== member.userId));
    }
  };

  const handleRemoveUser = (userId: string) => {
    if (selectedMembers.length === 1) return setSelectedMembers([]);
    setSelectedMembers(selectedMembers.filter((user) => user.userId !== userId));
  };

  const handleSubmitAddMember = () => {
    const userIds = selectedMembers.map((member) => member.userId);
    onAddedAction && onAddedAction(userIds);
  };

  const handleAddMember = () => {
    onAddedAction ? handleSubmitAddMember() : setMembers(selectedMembers);
    onBack();
  };

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberSearch(e.target.value);
  };

  const renderLoading = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <SearchResultSkeleton key={index} pageId={pageId} />
    ));
  };

  const renderSelectedMembers = () => {
    return selectedMembers.length > 0 ? (
      <div className={styles.communityAddMemberPage__selectedUsersWrap}>
        {selectedMembers.map((user) => (
          <div key={user.userId} className={styles.communityAddMemberPage__selectedUser}>
            <div className={styles.communityAddMemberPage__selectedUserAvatar}>
              <UserAvatar
                userId={user.userId}
                className={styles.communityAddMemberPage__memberAvatar}
              />
              <Button
                aria-label="close"
                className={styles.communityAddMemberPage__removeUserButton}
                onPress={() => handleRemoveUser(user.userId)}
              >
                <Clear className={styles.communityAddMemberPage__removeUser} />
              </Button>
            </div>

            <Typography.Body
              key={user.userId}
              className={styles.communityAddMemberPage__selectedUserDisplayName}
            >
              {user.displayName}
            </Typography.Body>
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.communityAddMemberPage__container}
    >
      <div className={styles.communityAddMemberPage__topbarSticky}>
        <div className={styles.communityAddMemberPage__navbar}>
          <CloseButton pageId={pageId} onPress={() => onBack()} />
          <Typography.Title>Add member</Typography.Title>
          <div className={styles.communityAddMemberPage__emptySapce} />
        </div>
        <div className={styles.communityAddMemberPage__searchWrap}>
          <Search
            data-search-value={memberSearch.length > 0}
            className={styles.communityAddMemberPage__searchIcon}
          />
          <Input
            className={styles.communityAddMemberPage__searchInput}
            type="text"
            placeholder="Search user"
            value={memberSearch}
            onChange={(e) => handleSearchUser(e)}
          />
          <Button
            aria-label="Close"
            data-search-value={memberSearch.length > 0}
            onPress={() => setMemberSearch('')}
            className={styles.communityAddMemberPage__clearSearchButton}
          >
            <Clear className={styles.communityAddMemberPage__clearSearch} />
          </Button>
        </div>
        {renderSelectedMembers()}
      </div>
      <div className={styles.communityAddMemberPage__memberList}>
        <CheckboxGroup aria-label="add-member-checkbox" className={styles.checkbox__group}>
          {(communityId
            ? memberSearch.length > 0
              ? nonMemberSearchUsers
              : nonMemberUsers
            : memberSearch.length > 0
              ? userSearchResults
              : users
          ).map((user) => (
            <div className={styles.checkbox__item} key={user.userId}>
              <label htmlFor={user.userId} className={styles.communityAddMemberPage__memberItem}>
                <div className={styles.communityAddMemberPage__leftSide}>
                  <UserAvatar
                    userId={user.userId}
                    className={styles.communityAddMemberPage__memberAvatar}
                  />
                  <Typography.BodyBold className={styles.communityAddMemberPage__memberName}>
                    {user.displayName}
                  </Typography.BodyBold>
                </div>
                <input
                  className={styles.communityAddMemberPage__checkbox}
                  type="checkbox"
                  id={user.userId}
                  checked={!!selectedMembers.find((c) => c.userId === user.userId)}
                  onChange={(e) =>
                    handleSelectMember(
                      {
                        userId: user.userId,
                        displayName: user.displayName ?? '',
                      },
                      e.target.checked,
                    )
                  }
                />
                <div aria-hidden="true">
                  <CheckboxIcon className={styles.communityAddMemberPage__checkboxIcon} />
                </div>
              </label>
            </div>
          ))}
          {isLoading || isSearchLoading ? renderLoading() : null}
        </CheckboxGroup>
        <div ref={(node) => setIntersectionNode(node)} />
      </div>
      <div className={styles.communityAddMemberPage__addMemberButton}>
        <Button
          data-qa-anchor={`${pageId}/*/add_member_button`}
          onPress={() => {
            handleAddMember();
          }}
          isDisabled={selectedMembers.length === 0}
          type="button"
          className={styles.communityAddMemberPage__button}
        >
          {members.length > 0 && <div></div>}
          <Typography.Title className={styles.communityCreateButton__text}>
            Add member
          </Typography.Title>
        </Button>
      </div>
    </div>
  );
};
