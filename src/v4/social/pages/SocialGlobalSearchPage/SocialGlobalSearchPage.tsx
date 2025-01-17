import { Key } from 'react-aria';
import { useClickAway } from 'react-use';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SecondaryTab } from '~/v4/core/components/SecondaryTab';
import { TopSearchBar } from '~/v4/social/components/TopSearchBar';
import { UserSearchResult } from '~/v4/social/components/UserSearchResult';
import { CommunitySearchResult } from '~/v4/social/components/CommunitySearchResult';
import useCommunitiesCollection from '~/v4/core/hooks/collections/useCommunitiesCollection';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import styles from './SocialGlobalSearchPage.module.css';

enum AmityGlobalSearchType {
  User = 'user',
  Community = 'community',
}

const useGlobalSearchViewModel = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [searchType, setSearchType] = useState<AmityGlobalSearchType>(
    AmityGlobalSearchType.Community,
  );

  const enabledUserSearch = useMemo(
    () => searchType === AmityGlobalSearchType.User && searchKeyword.length > 0,
    [searchType, searchKeyword],
  );

  const communityCollection = useCommunitiesCollection(
    { displayName: searchKeyword, limit: 20 },
    () => searchType === AmityGlobalSearchType.Community && searchKeyword.length > 0,
  );

  const userCollection = useUserQueryByDisplayName({
    displayName: searchKeyword,
    limit: 20,
    enabled: enabledUserSearch,
  });

  const search = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
    },
    [setSearchKeyword],
  );

  return {
    userCollection,
    communityCollection,
    searchType,
    search,
    searchValue: searchKeyword,
    setSearchType,
  };
};

export function SocialGlobalSearchPage() {
  const pageId = 'social_global_search_page';

  const ref = useRef<HTMLDivElement>(null);
  const { themeStyles } = useAmityPage({ pageId });
  const [activeTab, setActiveTab] = useState<Key>('communities');
  const [openSearchResult, setOpenSearchResult] = useState<boolean>(false);
  const { userCollection, communityCollection, search, searchValue, setSearchType } =
    useGlobalSearchViewModel();

  useClickAway(ref, () => setOpenSearchResult(false));

  const tabs = [
    {
      value: 'communities',
      label: 'Communities',
      accessibilityId: `${pageId}/top_search_bar/communities`,
      content: () => (
        <CommunitySearchResult
          pageId={pageId}
          isLoading={communityCollection.isLoading}
          onClosePopover={() => setOpenSearchResult(false)}
          communityCollection={communityCollection.communities}
          onLoadMore={() => {
            if (communityCollection.hasMore && communityCollection.isLoading === false) {
              communityCollection.loadMore();
            }
          }}
        />
      ),
    },
    {
      value: 'users',
      label: 'Users',
      accessibilityId: `${pageId}/top_search_bar/users`,
      content: () => (
        <UserSearchResult
          pageId={pageId}
          isLoading={userCollection.isLoading}
          userCollection={userCollection.users}
          onClosePopover={() => setOpenSearchResult(false)}
          onLoadMore={() => {
            if (userCollection.hasMore && userCollection.isLoading === false) {
              userCollection.loadMore();
            }
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.socialGlobalSearchPage} style={themeStyles}>
      <TopSearchBar pageId={pageId} search={search} onFocus={() => setOpenSearchResult(true)} />
      {searchValue.length > 0 && openSearchResult && (
        <div className={styles.socialGlobalSearchPage__searchResultContainer} ref={ref}>
          <SecondaryTab
            tabs={tabs}
            activeTab={activeTab}
            onChange={(newTab) => {
              setActiveTab(newTab);
              setSearchType(
                newTab === 'communities'
                  ? AmityGlobalSearchType.Community
                  : AmityGlobalSearchType.User,
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
