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
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { VideoButton } from '~/v4/social/elements/VideoButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { StoryButton } from '~/v4/social/elements/StoryButton/StoryButton';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import styles from './PostComposer.module.css';

type PostComposerProps = {
  pageId?: string;
  onClickPost?: () => void;
  onSelectFile?: (files: FileList | null) => void;
};

export function PostComposer({ pageId = '*', onClickPost, onSelectFile }: PostComposerProps) {
  const componentId = 'post_composer';

  const { currentUserId } = useSDK();
  const { openPopup } = usePopupContext();
  const { user } = useUser({ userId: currentUserId });
  const avatarUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const clickPost = () => {
    onClickPost
      ? onClickPost()
      : openPopup({
          pageId,
          componentId,
          view: 'desktop',
          header: (
            <Title pageId="select_post_target_page" titleClassName={styles.postComposer__title} />
          ),
          children: <SelectPostTargetPage />,
        });
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

  const renderStoryButton = () => {
    const isExcludedPage = pageId === 'user_profile_page';

    if (isExcludedPage) return null;

    if (pageId === 'community_profile_page') {
      return (
        <FileTrigger onSelect={onSelectFile}>
          <StoryButton pageId={pageId} componentId={componentId} />
        </FileTrigger>
      );
    }

    return <StoryButton pageId={pageId} componentId={componentId} onPress={onClickStory} />;
  };

  return (
    <div className={styles.postComposer} data-qa-anchor={accessibilityId} style={themeStyles}>
      <figure className={styles.postComposer__avatar}>
        <Avatar avatarUrl={avatarUrl} defaultImage={<UserIcon />} />
      </figure>
      <Button className={styles.postComposer__input} onPress={clickPost}>
        What's going on?
      </Button>
      <ImageButton onPress={clickPost} pageId={pageId} componentId={componentId} />
      <VideoButton onPress={clickPost} pageId={pageId} componentId={componentId} />
      {/* {renderStoryButton()} */}
    </div>
  );
}
