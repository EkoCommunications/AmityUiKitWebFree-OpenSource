import React, { RefObject, useEffect, useRef, useState } from 'react';
import { CommunityPostSettings, FileType, PostRepository } from '@amityco/ts-sdk';
import { useForm } from 'react-hook-form';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import {
  AmityPostComposerCreateOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { isMobile } from '~/v4/social/utils/isMobile';
import { generateThumbnailVideo } from '~/v4/social/utils/generateThumbnailVideo';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CreateNewPostButton } from '~/v4/social/elements/CreateNewPostButton';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { ImageThumbnail } from '~/v4/social/internal-components/ImageThumbnail';
import { VideoThumbnail } from '~/v4/social/internal-components/VideoThumbnail';
import ReactDOM from 'react-dom';
import { Drawer } from 'vaul';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { MediaAttachment } from '~/v4/social/components/MediaAttachment';
import { DetailedMediaAttachment } from '~/v4/social/components/DetailedMediaAttachment';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { MAXIMUM_POST_CHARACTERS } from '~/v4/social/constants';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import styles from './CreatePost.module.css';

const useResizeObserver = ({ ref }: { ref: RefObject<HTMLDivElement> }) => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.target.clientHeight);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return height;
};

export function CreatePost({ community, targetType, targetId }: AmityPostComposerCreateOptions) {
  const pageId = 'post_composer_page';
  const HEIGHT_MEDIA_ATTACHMENT_MENU = '6.75rem'; // const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU = '290px';Including file button
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 = '8.5rem'; //Show 1 menus
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 = '11rem'; //Show 2 menus
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3 = '14.5rem'; //Not including file button

  const drawerRef = useRef<HTMLDivElement>(null);
  const mentionRef = useRef<HTMLDivElement | null>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const { handleSubmit } = useForm();
  const { info } = useConfirmContext();
  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { confirm } = useConfirmContext();
  const { closePopup } = usePopupContext();
  const { onBack, prevPage } = useNavigation();
  const { prependItem } = useGlobalFeedContext();
  const { themeStyles } = useAmityPage({ pageId });
  const { AmityPostComposerPageBehavior } = usePageBehavior();
  const drawerHeight = useResizeObserver({ ref: drawerContentRef });
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });

  const [isShowBottomMenu] = useState<boolean>(true);
  const [snap, setSnap] = useState<string>(HEIGHT_MEDIA_ATTACHMENT_MENU);

  //Upload media
  const [postImages, setPostImages] = useState<Amity.File[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.File[]>([]);

  // Images/files incoming from uploads.
  const [incomingImages, setIncomingImages] = useState<File[]>([]);
  const [incomingVideos, setIncomingVideos] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedImagesCount, setUploadedImagesCount] = useState<File[]>([]);

  // Visible menu attachment
  const [isVisibleCamera, setIsVisibleCamera] = useState(false);
  const [isVisibleImage, setIsVisibleImage] = useState(true);
  const [isVisibleVideo, setIsVisibleVideo] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorUpload, setIsErrorUpload] = useState<string | undefined>();
  const [videoThumbnail, setVideoThumbnail] = useState<
    { file: File; videoUrl: string; thumbnail: string | undefined }[]
  >([]);
  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: '',
    mentioned: [],
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
    attachments: [
      {
        fileId: '',
        type: 'image',
      },
    ],
  });

  const onClearFailedUpload = () => {
    setIsErrorUpload(undefined);
    setIncomingImages([]);
    setIncomingVideos([]);
    setPostImages([]);
    setPostVideos([]);
  };

  useEffect(() => {
    if (typeof isErrorUpload !== 'undefined') {
      let message = 'Please try again later.';
      if (
        isErrorUpload.includes(
          'Amity SDK (500000): Image uploading failed: Suggestive content is not permitted',
        )
      ) {
        message = 'Suggestive content is not permitted';
      }

      confirm({
        pageId,
        title: 'Failed to upload media',
        content: message,
        onOk: () => onClearFailedUpload(),
        onCancel: () => onClearFailedUpload(),
      });
    }
  }, [isErrorUpload]);

  async function createPost(createPostParams: Parameters<typeof PostRepository.createPost>[0]) {
    try {
      setIsCreating(true);

      const postData = await PostRepository.createPost(createPostParams);

      const post = postData.data;

      setPostImages([]);
      setPostVideos([]);
      setIncomingImages([]);
      setIncomingVideos([]);

      const isModerator =
        (moderators || []).find((moderator) => moderator.userId === post.postedUserId) != null;

      if (!targetId) prependItem(postData.data);

      //TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
      if (
        ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
          .needApprovalOnPostCreation ||
          community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) &&
        !isModerator
      ) {
        info({
          pageId,
          content:
            'Your post has been submitted to pending list. It will be review by community moderator.',
          okText: 'OK',
        });
      } else {
        prependItem(postData.data);
      }
    } catch (error: unknown) {
      setIsError(true);
      if (error instanceof Error) {
        if (error.message === ERROR_RESPONSE.CONTAIN_BLOCKED_WORD) {
          notification.error({
            content: 'Text contain blocked word.',
          });
        }
      }
    } finally {
      setIsCreating(false);
      isDesktop
        ? closePopup()
        : prevPage?.type == PageTypes.SelectPostTargetPage
          ? AmityPostComposerPageBehavior?.goToSocialHomePage?.()
          : onBack();
    }
  }

  async function onCreatePost() {
    const attachments = [];

    if (textValue.text?.length && textValue.text.length > MAXIMUM_POST_CHARACTERS) {
      info({
        pageId,
        title: 'Unable to post',
        content: 'You have reached maximum 50,000 characters in a post.',
        okText: 'Done',
      });
      return;
    }

    if (postImages.length) {
      attachments.push(...postImages.map((i) => ({ fileId: i.fileId, type: FileType.IMAGE })));
    }

    if (postVideos.length) {
      attachments.push(...postVideos.map((i) => ({ fileId: i.fileId, type: FileType.VIDEO })));
    }

    const createPostParams: Parameters<typeof PostRepository.createPost>[0] = {
      targetId: targetId,
      targetType: targetType,
      data: { text: textValue.text },
      dataType: 'text',
      metadata: { mentioned: textValue.mentioned },
      mentionees: textValue.mentionees,
      attachments: attachments,
    };

    return createPost(createPostParams);
  }

  const onChange = (val: { mentioned: Mentioned[]; mentionees: Mentionees; text: string }) => {
    setTextValue((prev) => ({
      ...prev,
      mentioned: val.mentioned,
      text: val.text,
      mentionees: val.mentionees,
    }));
  };

  const handleSnapChange = (newSnap: string) => {
    if (snap === HEIGHT_MEDIA_ATTACHMENT_MENU && newSnap === '0px') {
      return;
    }
    setSnap(newSnap);
  };

  const onClickClose = () => {
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently deleted. It cannot be undone.',
      onOk: () => {
        AmityPostComposerPageBehavior?.goToSocialHomePage?.();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  useEffect(() => {
    if (postImages.length > 0) {
      setIsVisibleImage(true);
      setIsVisibleVideo(false);
    } else if (postVideos.length > 0 && videoThumbnail.length > 0) {
      setIsVisibleImage(false);
      setIsVisibleVideo(true);
    } else if (postImages.length == 0 || videoThumbnail.length == 0) {
      setIsVisibleImage(true);
      setIsVisibleVideo(true);
    }
  }, [postImages, postVideos, isVisibleImage, isVisibleVideo, videoThumbnail]);

  useEffect(() => {
    setIsVisibleCamera(isMobile());
  }, []);

  useEffect(() => {
    if (
      (!isVisibleCamera && isVisibleImage && isVisibleVideo) ||
      (isVisibleCamera && isVisibleImage && !isVisibleVideo) ||
      (isVisibleCamera && !isVisibleImage && isVisibleVideo)
    ) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2);
    } else if (
      (!isVisibleCamera && isVisibleImage && !isVisibleVideo) ||
      (!isVisibleCamera && !isVisibleImage && isVisibleVideo)
    ) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1);
    } else {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3);
    }
  }, [isVisibleCamera, isVisibleImage, isVisibleVideo]);

  const handleRemoveThumbnail = (index: number) => {
    setVideoThumbnail((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageFileChange = (file: File[]) => {
    if (file.length + uploadedImagesCount.length > 10) {
      confirm({
        pageId: pageId,
        type: 'info',
        title: 'Maximum upload limit reached',
        content:
          'You’ve reached the upload limit of 10 images. Any additional images will not be saved. ',
        okText: 'Close',
      });
      return;
    }

    if (file.length > 0) {
      setUploadedImagesCount((prevImages) => [...prevImages, ...file]);
      setIncomingImages(file);
    }
  };

  const handleVideoFileChange = async (file: File[]) => {
    const existingVideosCount = videoThumbnail ? videoThumbnail.length : 0;

    if (file.length + existingVideosCount > 10) {
      confirm({
        pageId: pageId,
        type: 'info',
        title: 'Maximum upload limit reached',
        content:
          'You’ve reached the upload limit of 10 videos. Any additional videos will not be saved. ',
        okText: 'Close',
      });
      return;
    }

    if (file.length > 0) {
      setIncomingVideos?.(file);
      const updatedVideos = file.map((file) => ({
        file,
        videoUrl: URL.createObjectURL(file),
        thumbnail: undefined,
      }));

      const thumbnailVideo = await Promise.all(
        updatedVideos.map(async (video) => {
          const thumbnail = await generateThumbnailVideo(video.file);
          return {
            ...video,
            thumbnail: thumbnail,
          };
        }),
      );
      setVideoThumbnail((prev) => [...prev, ...thumbnailVideo]);
    }
  };

  const notifications = (
    <div
      className={styles.createPost__notificationWrapper}
      data-item-position={snap === HEIGHT_MEDIA_ATTACHMENT_MENU}
    >
      {isCreating && (
        <Notification
          icon={<Spinner />}
          content="Posting..."
          className={styles.createPost__notification}
        />
      )}
      {isError && (
        <Notification
          duration={3000}
          content="Failed to create post"
          className={styles.createPost__notification}
          icon={<ExclamationCircle className={styles.createPost_notificationIcon} />}
        />
      )}
    </div>
  );

  const isShowDetailMediaAttachmentMenu =
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3;

  return (
    <div className={styles.createPost} style={themeStyles}>
      {isDesktop && notifications}
      <form
        className={styles.createPost__form}
        onSubmit={handleSubmit(onCreatePost)}
        data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
      >
        <div className={styles.createPost__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <CommunityDisplayName pageId={pageId} community={community} />
          <CreateNewPostButton
            pageId={pageId}
            variant="text"
            isDisabled={
              !(textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0) ||
              isCreating
            }
          />
        </div>
        <div className={styles.createPost__formContent}>
          <PostTextField
            pageId={pageId}
            onChange={onChange}
            communityId={targetId}
            className={styles.createPost__input}
            dataValue={{ data: { text: textValue.text } }}
            placeholderClassName={styles.createPost__placeholder}
            mentionContainer={isDesktop ? null : mentionRef.current}
            mentionContainerClassName={styles.createPost__mentionContainer}
          />
          <ImageThumbnail
            pageId={pageId}
            files={incomingImages}
            uploadedFiles={postImages}
            onError={setIsErrorUpload}
            uploadLoading={uploadLoading}
            isErrorUpload={isErrorUpload}
            onLoadingChange={setUploadLoading}
            onChange={({ uploaded, uploading }) => {
              setPostImages(uploaded);
              setIncomingImages(uploading);
            }}
          />
          <VideoThumbnail
            pageId={pageId}
            files={incomingVideos}
            uploadedFiles={postVideos}
            onError={setIsErrorUpload}
            uploadLoading={uploadLoading}
            isErrorUpload={isErrorUpload}
            videoThumbnail={videoThumbnail}
            onLoadingChange={setUploadLoading}
            removeThumbnail={handleRemoveThumbnail}
            onChange={({ uploaded, uploading }) => {
              setPostVideos(uploaded);
              setIncomingVideos(uploading);
            }}
          />
        </div>
        <div className={styles.createPost__attachment}>
          <MediaAttachment
            pageId={pageId}
            isVisibleImage={isVisibleImage}
            isVisibleVideo={isVisibleVideo}
            isVisibleCamera={isVisibleCamera}
            onVideoFileChange={handleVideoFileChange}
            onImageFileChange={handleImageFileChange}
          />
        </div>
        <div className={styles.createPost__ctaWrapper}>
          <CreateNewPostButton
            variant="fill"
            pageId={pageId}
            className={styles.createPost__cta}
            isDisabled={
              !(textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0) ||
              isCreating
            }
          />
        </div>
        <div
          ref={mentionRef}
          className={styles.createPost__mention}
          data-qa-anchor={`${pageId}/mention_text_input_options`}
          style={{ '--asc-mention-bottom': `${drawerHeight ?? 0}px` } as React.CSSProperties}
        />
      </form>
      {!isDesktop && (
        <div className={styles.createPost__attachmentDrawer}>
          <div ref={drawerRef}></div>
          {drawerRef.current
            ? ReactDOM.createPortal(
                <Drawer.Root
                  noBodyStyles
                  modal={false}
                  open={isShowBottomMenu}
                  activeSnapPoint={snap}
                  snapPoints={[
                    HEIGHT_MEDIA_ATTACHMENT_MENU,
                    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1,
                    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2,
                    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3,
                  ]}
                  setActiveSnapPoint={(newSnapPoint) => {
                    typeof newSnapPoint === 'string' && handleSnapChange(newSnapPoint);
                  }}
                >
                  <Drawer.Portal container={drawerRef.current}>
                    <Drawer.Content className={styles.createPost__attachmentDrawer__content}>
                      <div
                        ref={drawerContentRef}
                        className={styles.createPost__attachmentDrawer__contentContainer}
                        data-show-detail-media-attachment={isShowDetailMediaAttachmentMenu}
                      >
                        {isShowDetailMediaAttachmentMenu ? (
                          <DetailedMediaAttachment
                            pageId={pageId}
                            isVisibleImage={isVisibleImage}
                            isVisibleVideo={isVisibleVideo}
                            isVisibleCamera={isVisibleCamera}
                            onImageFileChange={handleImageFileChange}
                            onVideoFileChange={handleVideoFileChange}
                          />
                        ) : (
                          <MediaAttachment
                            pageId={pageId}
                            isVisibleImage={isVisibleImage}
                            isVisibleVideo={isVisibleVideo}
                            isVisibleCamera={isVisibleCamera}
                            onImageFileChange={handleImageFileChange}
                            onVideoFileChange={handleVideoFileChange}
                          />
                        )}
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>,
                drawerRef.current,
              )
            : null}
          {isCreating && (
            <Notification
              content="Posting..."
              icon={<Spinner />}
              className={styles.createPost__notification}
              isShowAttributes={
                isShowDetailMediaAttachmentMenu
                  ? snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2
                    ? '2'
                    : '3'
                  : '1'
              }
            />
          )}
          {isError && (
            <Notification
              content="Failed to create post"
              icon={<ExclamationCircle className={styles.createPost_notificationIcon} />}
              className={styles.createPost__notification}
              data-show-detail-media-attachment={isShowDetailMediaAttachmentMenu}
              duration={3000}
            />
          )}
        </div>
      )}
    </div>
  );
}
