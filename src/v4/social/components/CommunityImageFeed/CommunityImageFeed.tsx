import React, { useEffect, useState } from 'react';
import styles from './CommunityImageFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { ImageGallery } from '~/v4/social/internal-components/ImageGallery';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { EmptyCommunityImageFeed } from '~/v4/social/elements/EmptyCommunityImageFeed';

type CommunityImageFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityImageFeed = ({ pageId = '*', communityId }: CommunityImageFeedProps) => {
  const componentId = 'community_image_feed';
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { posts, hasMore, loadMore, refresh, isLoading } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    limit: 10,
    dataTypes: ['image'],
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
      <div key={index} className={styles.communityImageFeed__containerSkeleton}>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
        <div className={styles.communityImageFeed__itemSkeleton}></div>
      </div>
    ));
  };

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.communityImageFeed__container}
    >
      {posts?.length === 0 && !isLoading && (
        <EmptyCommunityImageFeed pageId={pageId} componentId={componentId} />
      )}
      {posts?.length > 0 && !isLoading && (
        <ImageGallery posts={posts} pageId={pageId} componentId={communityId} />
      )}
      {isLoading && renderLoading()}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
};
