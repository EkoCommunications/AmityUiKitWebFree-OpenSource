import React from 'react';
import styles from './CommunityHeader.module.css';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { CommunityPendingPost } from '~/v4/social/elements/CommunityPendingPost';
import { CommunityCover } from '~/v4/social/elements/CommunityCover';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton';
import { useCommunityInfo } from '~/v4/social/hooks/useCommunityInfo';
import { useCommunityTabContext } from '~/v4/core/providers/CommunityTabProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityVerifyBadge } from '~/v4/social/elements/CommunityVerifyBadge';
import { CommunityDescription } from '~/v4/social/elements/CommunityDescription';
import { CommunityName } from '~/v4/social/elements/CommunityName';
import { CommunityInfo } from '~/v4/social/elements/CommunityInfo';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import Lock from '~/v4/icons/Lock';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { CommunityPostSettings } from '@amityco/ts-sdk';

interface CommunityProfileHeaderProps {
  pageId?: string;
  community: Amity.Community;
  isSticky?: boolean;
}

export const CommunityHeader: React.FC<CommunityProfileHeaderProps> = ({
  pageId = '*',
  community,
  isSticky,
}) => {
  const componentId = 'community_header';
  const { onBack } = useNavigation();
  const { activeTab, setActiveTab } = useCommunityTabContext();
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { currentUserId } = useSDK();

  const {
    avatarFileUrl,
    joinCommunity,
    pendingPostsCount,
    reviewingPosts,
    canReviewCommunityPosts,
  } = useCommunityInfo(community.communityId);

  const isPostOwner = reviewingPosts.some((post) => post.postedUserId === currentUserId);

  //TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
  const isShowPendingPost =
    community.isJoined &&
    pendingPostsCount > 0 &&
    reviewingPosts.length > 0 &&
    (canReviewCommunityPosts || isPostOwner) &&
    ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
      .needApprovalOnPostCreation ||
      community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED);

  return (
    <>
      <CommunityCover
        pageId={pageId}
        componentId={componentId}
        image={avatarFileUrl}
        community={community}
        onBack={onBack}
        isSticky={isSticky}
        onClickMenu={() => {
          AmityCommunityProfilePageBehavior?.goToCommunitySettingPage?.({
            community: community,
          });
        }}
      />
      <div className={styles.content}>
        <div className={styles.name}>
          {!community.isPublic && <Lock className={styles.communityProfile__privateIcon} />}
          <CommunityName pageId={pageId} componentId={componentId} name={community.displayName} />
          {community.isOfficial && <CommunityVerifyBadge />}
        </div>

        <div className={styles.communityProfile__communityCategories}>
          <CommunityCategories
            pageId={pageId}
            componentId={componentId}
            community={community}
            minCategoryCharacters={10}
          />
        </div>

        <CommunityDescription
          pageId={pageId}
          componentId={componentId}
          description={community.description || ''}
        />

        <div className={styles.communityProfile__communityInfo__container}>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.postsCount}
            text="posts"
          />
          <div className={styles.divider}></div>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.membersCount}
            text="members"
            onClick={() => {
              AmityCommunityProfilePageBehavior?.goToMembershipPage?.({
                community: community,
              });
            }}
          />
        </div>

        {!community.isJoined && community.isPublic && (
          <div className={styles.communityProfile__joinButton__container}>
            <CommunityJoinButton
              pageId={pageId}
              componentId={componentId}
              onClick={joinCommunity}
            />
          </div>
        )}
        <div>
          <StoryTab type="communityFeed" pageId={pageId} communityId={community.communityId} />
        </div>

        {isShowPendingPost && (
          <div className={styles.communityProfile__pendingPost__container}>
            <CommunityPendingPost
              pageId={pageId}
              componentId={componentId}
              pendingPostsCount={pendingPostsCount}
              onClick={() => {
                AmityCommunityProfilePageBehavior?.goToPendingPostPage?.({
                  communityId: community.communityId,
                });
              }}
              isPostOwner={isPostOwner}
              canReviewCommunityPosts={canReviewCommunityPosts}
            />
          </div>
        )}
      </div>

      <div className={styles.communityProfile__divider} />
    </>
  );
};
