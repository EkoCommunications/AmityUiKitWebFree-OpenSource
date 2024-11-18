import React, { useEffect, useRef, useState } from 'react';
import styles from './CommunityProfilePage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CommunityHeader } from '~/v4/social/components/CommunityHeader';
import { CommunityFeed } from '~/v4/social/components/CommunityFeed';
import { CommunityProfileSkeleton } from '~/v4/social/pages/CommunityProfilePage/CommunityProfilePageSkeleton';
import { CommunityTab, useCommunityTabContext } from '~/v4/core/providers/CommunityTabProvider';
import { CommunityPin } from '~/v4/social/components/CommunityPin';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { RefreshSpinner } from '~/v4/icons/RefreshSpinner';
import { CommunityCreatePostButton } from '~/v4/social/elements/CommunityCreatePostButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Mode } from '~/v4/social/pages/PostComposerPage';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { FileTrigger } from 'react-aria-components';
import { CommunityImageFeed } from '~/v4/social/components/CommunityImageFeed';
import { CommunityVideoFeed } from '~/v4/social/components/CommunityVideoFeed';
import { CommunityProfileTab } from '~/v4/social/elements/CommunityProfileTab';

interface CommunityProfileProps {
  communityId: string;
}

export const CommunityProfilePage: React.FC<CommunityProfileProps> = ({ communityId }) => {
  const { activeTab, setActiveTab } = useCommunityTabContext();
  const pageId = 'community_profile_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const { AmityCommunityProfilePageBehavior } = usePageBehavior();

  const { community } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });

  const touchStartY = useRef(0);
  const [touchDiff, setTouchDiff] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { file, setFile } = useStoryContext();
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'community_feed':
        return <CommunityFeed pageId={pageId} communityId={communityId} />;
      case 'community_pin':
        return <CommunityPin pageId={pageId} communityId={communityId} />;
      case 'community_image_feed':
        return <CommunityImageFeed pageId={pageId} communityId={communityId} />;
      case 'community_video_feed':
        return <CommunityVideoFeed pageId={pageId} communityId={communityId} />;
      default:
        return null;
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
    removeDrawerData();
  };

  const handleRefresh = async () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (file) {
      AmityCommunityProfilePageBehavior?.goToStoryCreationPage?.({
        targetId: communityId,
        targetType: 'community',
        mediaType:
          file && file?.type.includes('image')
            ? { type: 'image', url: URL.createObjectURL(file) }
            : { type: 'video', url: URL.createObjectURL(file!) },
        storyType: 'communityFeed',
      });
    }
  }, [file]);

  const handleTabChange = (tab: CommunityTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;

        if (scrollPosition > 95) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-qa-anchor={accessibilityId}
      className={styles.communityProfilePage__container}
      style={themeStyles}
      onDrag={(event) => event.stopPropagation()}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        const touchY = e.touches[0].clientY;

        if (touchStartY.current > touchY) {
          return;
        }

        setTouchDiff(Math.min(touchY - touchStartY.current, 100));
      }}
      onTouchEnd={(e) => {
        touchStartY.current = 0;
        if (touchDiff >= 75) {
          handleRefresh();
        }
        setTouchDiff(0);
      }}
    >
      <div
        style={
          {
            '--asc-pull-to-refresh-height': `${touchDiff}px`,
          } as React.CSSProperties
        }
        className={styles.communityProfilePage__pullToRefresh}
      >
        <RefreshSpinner className={styles.communityProfilePage__pullToRefresh__spinner} />
      </div>
      {community ? (
        <>
          <CommunityHeader pageId={pageId} community={community} isSticky={isSticky} />
          <CommunityProfileTab
            pageId={pageId}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className={styles.communityProfile__divider} />
        </>
      ) : (
        <CommunityProfileSkeleton />
      )}
      <div key={refreshKey}>{renderTabContent()}</div>
      <div className={styles.communityProfilePage__createPostButton}>
        <CommunityCreatePostButton
          pageId={pageId}
          onPress={() =>
            setDrawerData({
              content: (
                <>
                  <CreatePostButton
                    pageId={pageId}
                    onClick={() => {
                      AmityCommunityProfilePageBehavior?.goToPostComposerPage?.({
                        mode: Mode.CREATE,
                        targetId: communityId,
                        targetType: 'community',
                        community: community as Amity.Community,
                      });
                      removeDrawerData();
                    }}
                  />
                  <FileTrigger onSelect={handleFileSelect}>
                    <CreateStoryButton pageId={pageId} />
                  </FileTrigger>
                </>
              ),
            })
          }
        />
      </div>
    </div>
  );
};
