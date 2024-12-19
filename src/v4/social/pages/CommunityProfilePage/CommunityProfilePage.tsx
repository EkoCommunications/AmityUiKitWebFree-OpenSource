import React, { useEffect, useRef, useState } from 'react';
import styles from './CommunityProfilePage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CommunityHeader } from '~/v4/social/components/CommunityHeader';
import { CommunityFeed } from '~/v4/social/components/CommunityFeed';
import { CommunityProfileSkeleton } from '~/v4/social/pages/CommunityProfilePage/CommunityProfilePageSkeleton';
import { CommunityTab, useCommunityTabContext } from '~/v4/core/providers/CommunityTabProvider';
import { CommunityPin } from '~/v4/social/components/CommunityPin';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { CommunityCreatePostButton } from '~/v4/social/elements/CommunityCreatePostButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { FileTrigger } from 'react-aria-components';
import { CommunityImageFeed } from '~/v4/social/components/CommunityImageFeed';
import { CommunityVideoFeed } from '~/v4/social/components/CommunityVideoFeed';
import { CommunityProfileTab } from '~/v4/social/elements/CommunityProfileTab';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
// import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';

interface CommunityProfileProps {
  communityId: string;
  page?: number;
}

export const CommunityProfilePage: React.FC<CommunityProfileProps> = ({ communityId, page }) => {
  const { activeTab, setActiveTab } = useCommunityTabContext();
  const pageId = 'community_profile_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const { openPopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();

  const { community } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });

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
    <PullToRefresh
      ref={containerRef}
      style={themeStyles}
      accessibilityId={accessibilityId}
      onTouchEndCallback={handleRefresh}
      className={styles.communityProfilePage__container}
    >
      {community ? (
        <>
          <CommunityHeader pageId={pageId} community={community} isSticky={isSticky} page={page} />
          <CommunityProfileTab
            pageId={pageId}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </>
      ) : (
        <CommunityProfileSkeleton />
      )}
      {(activeTab === 'community_feed' || activeTab === 'community_pin') && (
        <div className={styles.communityProfilePage__poseComposer}>
          <PostComposer
            pageId={pageId}
            onSelectFile={handleFileSelect}
            onClickPost={() => {
              openPopup({
                pageId,
                view: 'desktop',
                isDismissable: false,
                onClose: ({ close }) => {
                  confirm({
                    onOk: close,
                    type: 'confirm',
                    okText: 'Discard',
                    cancelText: 'Keep editing',
                    title: 'Discard this post?',
                    pageId: 'post_composer_page',
                    content: 'The post will be permanently deleted. It cannot be undone.',
                  });
                },
                header: (
                  <CommunityDisplayName
                    pageId="post_composer_page"
                    community={community as Amity.Community}
                    className={styles.selectPostTargetPage__displayName}
                  />
                ),
                children: (
                  <PostComposerPage
                    mode={Mode.CREATE}
                    targetType="community"
                    community={community as Amity.Community}
                    targetId={community?.communityId as string}
                  />
                ),
              });
            }}
          />
        </div>
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
                  {/* <CreatePollButton
                    pageId={pageId}
                    componentId={communityId}
                    onClick={() => {
                      AmityCommunityProfilePageBehavior?.goToPollPostComposerPage?.({
                        targetId: communityId,
                        targetType: 'community',
                      });
                      removeDrawerData();
                    }}
                  /> */}
                </>
              ),
            })
          }
        />
      </div>
    </PullToRefresh>
  );
};
