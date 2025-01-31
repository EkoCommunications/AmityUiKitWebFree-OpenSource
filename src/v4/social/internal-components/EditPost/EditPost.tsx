import React, { useEffect, useRef, useState } from 'react';
import styles from './EditPost.module.css';
import { PostContentType, PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { LexicalEditor } from 'lexical';
import { useForm } from 'react-hook-form';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  AmityPostComposerEditOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import { EditPostButton } from '~/v4/social/elements/EditPostButton';
import { EditPostTitle } from '~/v4/social/elements/EditPostTitle';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { ExclamationCircle } from '~/icons';
import { Thumbnail } from './Thumbnail';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { arraysContainSameElements } from '~/v4/social/utils/arraysContainSameElements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { MAXIMUM_POST_CHARACTERS } from '~/v4/social/constants';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

export function EditPost({ post }: AmityPostComposerEditOptions) {
  const pageId = 'post_composer_page';
  const { isDesktop } = useResponsive();
  const { closePopup } = usePopupContext();
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const { onBack } = useNavigation();
  const { confirm } = useConfirmContext();
  const { updateItem } = useGlobalFeedContext();
  const { info } = useConfirmContext();

  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: post.data.text ?? '',
    mentioned: post.metadata?.mentioned || [],
    mentionees: post.mentionees,
    attachments: [
      {
        fileId: '',
        type: 'image',
      },
    ],
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [postErrorText, setPostErrorText] = useState<string | undefined>();

  const [postImages, setPostImages] = useState<Amity.File[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.File[]>([]);

  const [defaultPostImages, setDefaultPostImages] = useState<Amity.File[]>([]);
  const [defaultPostVideo, setDefaultPostVideo] = useState<Amity.File[]>([]);

  const mentionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const useMutateUpdatePost = () =>
    useMutation({
      mutationFn: async (params: Parameters<typeof PostRepository.editPost>[0]) => {
        return await PostRepository.editPost(post.postId, params);
      },
      onSuccess: (response) => {
        isDesktop ? closePopup() : onBack();
        updateItem(response.data);
      },
      onError: (error) => {
        if (error.message.includes(ERROR_RESPONSE.CONTAIN_BLOCKED_WORD)) {
          setPostErrorText("Your post wasn't posted because it contains a blocked word.");
          return;
        } else if (error.message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)) {
          setPostErrorText(
            "Your post wasn't posted because it contains a link that’s not allowed.",
          );
          return;
        } else {
          setPostErrorText('Failed to post.');
          return;
        }
      },
    });

  const { mutateAsync: mutateUpdatePostAsync, isPending, isError } = useMutateUpdatePost();

  const { handleSubmit } = useForm();
  const posts = usePostByIds(post?.children || []);

  useEffect(() => {
    const imagePosts = posts.filter((post) => post.dataType === 'image');
    setDefaultPostImages(imagePosts);
    setPostImages(imagePosts);
    const videoPosts = posts.filter((post) => post.dataType === 'video');
    setDefaultPostVideo(videoPosts);
    setPostVideos(videoPosts);
  }, [posts]);

  const handleRemoveThumbnailImage = (fieldId: string) => {
    setPostImages((prevImages) =>
      prevImages.filter((item: Amity.Post<'image'>) => item.data.fileId !== fieldId),
    );
  };

  const handleRemoveThumbnailVideo = (fieldId: string) => {
    setPostVideos((prevVideos) =>
      prevVideos.filter((item: Amity.Post<'video'>) => item.data.videoFileId.original !== fieldId),
    );
  };

  const onSave = () => {
    if (textValue.text?.length && textValue.text.length > MAXIMUM_POST_CHARACTERS) {
      setPostErrorText('You have reached maximum 50,000 characters in a post.');
      return;
    }
    const attachmentsImage = postImages.map((item: Amity.Post<'image'>) => {
      return {
        fileId: item.data.fileId,
        type: PostContentType.IMAGE,
      };
    });

    const attachmentsVideo = postVideos.map((item: Amity.Post<'video'>) => {
      return { fileId: item.data.videoFileId.original, type: 'video' };
    });

    const attachments = [...attachmentsImage, ...attachmentsVideo];

    if (textValue) {
      mutateUpdatePostAsync({
        data: { text: textValue.text },
        metadata: { mentioned: textValue.mentioned ?? [] },
        mentionees: textValue.mentionees ?? [],
        attachments: attachments,
      });
    }
  };

  const onChange = (val: { mentioned: Mentioned[]; mentionees: Mentionees; text: string }) => {
    setTextValue((prev) => ({
      ...prev,
      mentioned: val.mentioned,
      text: val.text,
      mentionees: val.mentionees,
    }));
  };

  const onClickClose = () => {
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently discarded. It cannot be undone.',
      onOk: () => {
        onBack();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  const isImageChanged = !arraysContainSameElements(defaultPostImages, postImages);
  const isVideoChanged = !arraysContainSameElements(defaultPostVideo, postVideos);

  return (
    <div className={styles.editPost} style={themeStyles}>
      <form onSubmit={handleSubmit(onSave)} className={styles.editPost__form}>
        <div className={styles.editPost__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <EditPostTitle pageId={pageId} />
          <EditPostButton
            variant="text"
            pageId={pageId}
            isDisabled={
              !isOnline ||
              (post.data.text == textValue.text && !isImageChanged && !isVideoChanged) ||
              !(textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0)
            }
          />
        </div>
        <div className={styles.editPost__formContent}>
          <PostTextField
            pageId={pageId}
            onChange={onChange}
            className={styles.editPost__input}
            placeholderClassName={styles.editPost__placeholder}
            mentionContainer={isDesktop ? null : mentionRef.current}
            mentionContainerClassName={styles.editPost__mentionContainer}
            communityId={post.targetType === 'community' ? post.targetId : undefined}
            dataValue={{
              mentionees: post.mentionees,
              data: { text: post.data.text },
              metadata: { mentioned: post.metadata?.mentioned || [] },
            }}
          />
          <Thumbnail pageId={pageId} postMedia={postImages} onRemove={handleRemoveThumbnailImage} />
          <Thumbnail postMedia={postVideos} onRemove={handleRemoveThumbnailVideo} />
        </div>
        <div className={styles.editPost__ctaWrapper}>
          <EditPostButton
            variant="fill"
            pageId={pageId}
            className={styles.editPost__cta}
            onPress={() => handleSubmit(onSave)}
            isDisabled={
              (post.data.text == textValue.text && !isImageChanged && !isVideoChanged) ||
              !(textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0) ||
              isPending
            }
          />
        </div>
        <div ref={mentionRef} className={styles.editPost__mention} />
        <div className={styles.editPost__notificationContainer}>
          {(isPending || !isOnline) && (
            <Notification
              icon={<Spinner />}
              content={isOnline ? 'Posting...' : 'Waiting for network...'}
              className={styles.editPost__notification}
            />
          )}
          {postErrorText && (
            <Notification
              duration={3000}
              content={postErrorText || 'Failed to post.'}
              className={styles.editPost__notification}
              icon={<ExclamationCircle className={styles.editPost__notificationIcon} />}
              onClose={() => {
                setPostErrorText(undefined);
              }}
            />
          )}
        </div>
      </form>
    </div>
  );
}
