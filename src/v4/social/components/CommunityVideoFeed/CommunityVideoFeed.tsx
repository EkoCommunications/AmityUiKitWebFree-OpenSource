import React, { useEffect, useState } from 'react';
import styles from './CommunityVideoFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptyCommunityVideoFeed } from '~/v4/social/elements/EmptyCommunityVideoFeed';
import { VideoGallery } from '~/v4/social/internal-components/VideoGallery';

type CommunityVideoFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityVideoFeed = ({ pageId = '*', communityId }: CommunityVideoFeedProps) => {
  const componentId = 'community_video_feed';
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    limit: 10,
    dataTypes: ['video'],
  });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  if (isExcluded) return null;

  useEffect(() => {
    refresh();
  }, []);

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
  });

  const renderLoading = () => {
    return Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className={styles.communityVideoFeed__containerSkeleton}>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
        <div className={styles.communityVideoFeed__itemSkeleton}></div>
      </div>
    ));
  };

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.communityVideoFeed__container}
    >
      {posts?.length === 0 && !isLoading && (
        <EmptyCommunityVideoFeed pageId={pageId} componentId={componentId} />
      )}
      {posts?.length > 0 && !isLoading && (
        <VideoGallery posts={posts} pageId={pageId} componentId={communityId} />
      )}
      {isLoading && renderLoading()}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
