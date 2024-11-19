import React from 'react';
import styles from './PendingPostsPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements';
import { Title } from '~/v4/social/elements/Title';
import { Typography } from '~/v4/core/components';
import { useCommunityInfo } from '~/v4/social/hooks';
import { PendingPostContent } from '~/v4/social/components/PendingPostContent';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import FireworkPaper from '~/v4/icons/FireworkPaper';
import { CommunityFeedPostContentSkeleton } from '~/v4/social/components/CommunityFeed/CommunityFeed';
import { useSDK } from '~/v4/core/hooks/useSDK';

type PendingPostsPageProps = {
  communityId: string;
};

export const PendingPostsPage = ({ communityId }: PendingPostsPageProps) => {
  const pageId = 'pending_posts_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { currentUserId } = useSDK();
  const { pendingPostsCount, canReviewCommunityPosts } = useCommunityInfo(communityId);
  const { posts: reviewingPosts, isLoading } = usePostsCollection({
    targetType: 'community',
    targetId: communityId,
    feedType: 'reviewing',
  });

  const isPostOwner = reviewingPosts.some((post) => post.postedUserId === currentUserId);

  return (
    <div
      data-qa-anchor={accessibilityId}
      className={styles.pendingPostsPage__container}
      style={themeStyles}
    >
      <div className={styles.pendingPostsPage__topBar}>
        <BackButton onPress={onBack} />
        <div className={styles.pendingPostsPage__titleWrap}>
          <Title titleClassName={styles.pendingPostsPage__title} pageId={pageId} />
          <Typography.Title>{`(${pendingPostsCount})`}</Typography.Title>
        </div>

        <div className={styles.pendingPostsPage__emptyDiv} />
      </div>
      {isLoading &&
        Array.from({ length: 3 }).map((_, index) => (
          <CommunityFeedPostContentSkeleton key={index} />
        ))}
      {reviewingPosts.length === 0 && !isLoading && (
        <div className={styles.pendingPostsPage__noPendingPost}>
          <Typography.Title className={styles.pendingPostsPage__noPendingPostText}>
            No pending posts
          </Typography.Title>
          <FireworkPaper className={styles.pendingPostsPage__fireworkIcon} />
        </div>
      )}
      {!isLoading && pendingPostsCount > 0 && (canReviewCommunityPosts || isPostOwner) && (
        <>
          {canReviewCommunityPosts && (
            <div className={styles.pendingPostsPage__descWrap}>
              <Typography.Caption className={styles.pendingPostsPage__desc}>
                Decline pending post will permanently delete the selected post from community.
              </Typography.Caption>
            </div>
          )}
          {reviewingPosts.length > 0 &&
            reviewingPosts?.map((post) => (
              <PendingPostContent
                pageId={pageId}
                post={post}
                canReviewCommunityPosts={canReviewCommunityPosts}
              />
            ))}
        </>
      )}
    </div>
  );
};
