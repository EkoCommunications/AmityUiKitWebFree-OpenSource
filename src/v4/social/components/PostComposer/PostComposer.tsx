import React from 'react';
import UserIcon from '~/v4/icons/User';
import useSDK from '~/v4/core/hooks/useSDK';
import { Avatar } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { Title } from '~/v4/social/elements/Title';
import { useImage } from '~/v4/core/hooks/useImage';
import { FileTrigger } from 'react-aria-components';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { StoryButton } from '~/v4/social/elements/StoryButton/StoryButton';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage/';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import styles from './PostComposer.module.css';
import { PollButton } from '~/v4/social/elements/PollButton';
import { PollTargetSelectionPage } from '~/v4/social/pages/PollTargetSelectionPage';

type PostComposerProps = {
  pageId?: string;
  onClickPost?: () => void;
  onSelectFile?: (files: FileList | null) => void;
};

export function PostComposer({ pageId = '*', onClickPost, onSelectFile }: PostComposerProps) {
  const componentId = 'post_composer';

  const { currentUserId } = useSDK();
  const { confirm } = useConfirmContext();
  const { openPopup, closePopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const { AmityPostTargetSelectionPage } = usePageBehavior();
  const { user } = useUser({ userId: currentUserId });
  const avatarUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const handlePostClick = () => {
    if (onClickPost) {
      onClickPost();
      return;
    }

    if (pageId === 'user_profile_page' && currentUserId === user?.userId) {
      if (isDesktop) {
        openPopup({
          pageId,
          view: 'desktop',
          isDismissable: false,
          onClose: () => {
            confirm({
              type: 'confirm',
              onOk: closePopup,
              okText: 'Discard',
              cancelText: 'Keep editing',
              title: 'Discard this post?',
              pageId: 'post_composer_page',
              content: 'The post will be permanently deleted. It cannot be undone.',
            });
          },
          header: (
            <CommunityDisplayName
              community={undefined}
              pageId="post_composer_page"
              className={styles.selectPostTargetPage__displayName}
            />
          ),
          children: (
            <PostComposerPage
              targetId={null}
              targetType="user"
              mode={Mode.CREATE}
              community={undefined}
            />
          ),
        });
      } else {
        AmityPostTargetSelectionPage?.goToPostComposerPage?.({
          mode: Mode.CREATE,
          targetId: null,
          targetType: 'user',
          community: undefined,
        });
      }
    } else {
      // Default behavior for other cases
      openPopup({
        pageId,
        componentId,
        view: 'desktop',
        header: (
          <Title pageId="select_post_target_page" titleClassName={styles.postComposer__title} />
        ),
        children: <SelectPostTargetPage />,
      });
    }
  };
  const onClickStory = () => {
    openPopup({
      pageId,
      componentId,
      view: 'desktop',
      header: (
        <Title pageId="select_story_target_page" titleClassName={styles.postComposer__title} />
      ),
      children: <StoryTargetSelectionPage />,
    });
  };

  const onClickPoll = () => {
    openPopup({
      pageId,
      componentId,
      view: 'desktop',
      header: (
        <Title pageId="select_poll_target_page" titleClassName={styles.postComposer__title} />
      ),
      children: <PollTargetSelectionPage />,
    });
  };

  const renderStoryButton = () => {
    const isExcludedPage = pageId === 'user_profile_page';

    if (isExcludedPage) return null;

    if (pageId === 'community_profile_page') {
      return (
        <FileTrigger onSelect={onSelectFile}>
          <StoryButton
            pageId={pageId}
            componentId={componentId}
            defaultIconClassName={styles.postComposer__button}
          />
        </FileTrigger>
      );
    }

    return (
      <StoryButton
        pageId={pageId}
        componentId={componentId}
        defaultIconClassName={styles.postComposer__button}
        onPress={onClickStory}
      />
    );
  };

  return (
    <div className={styles.postComposer} data-qa-anchor={accessibilityId} style={themeStyles}>
      <figure className={styles.postComposer__avatar}>
        <Avatar avatarUrl={avatarUrl} defaultImage={<UserIcon />} />
      </figure>
      <Button className={styles.postComposer__input} onPress={handlePostClick}>
        What's going on?
      </Button>
      <ImageButton
        onPress={handlePostClick}
        pageId={pageId}
        componentId={componentId}
        defaultIconClassName={styles.postComposer__button}
      />
      <VideoButton
        onPress={handlePostClick}
        pageId={pageId}
        componentId={componentId}
        defaultIconClassName={styles.postComposer__button}
      />
      <PollButton onPress={onClickPoll} pageId="post_composer_page" componentId="poll_button" />
      {renderStoryButton()}
    </div>
  );
}
