import React, { useEffect, useState } from 'react';
import styles from './CreateCommunity.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { Title } from '~/v4/social/elements/Title';
import { CloseButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityNameTitle } from '~/v4/social/elements/CommunityNameTitle';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { Camera } from '~/v4/icons/Camera';
import { Avatar, Typography } from '~/v4/core/components';
import { CommunityAboutTitle } from '~/v4/social/elements/CommunityAboutTitle';
import { CommunityCategoryTitle } from '~/v4/social/elements/CommunityCategoryTitle';
import AngleRight from '~/v4/icons/AngleRight';
import { CommunityPrivacyTitle } from '~/v4/social/elements/CommunityPrivacyTitle';
import { CommunityPrivacyPrivateIcon } from '~/v4/social/elements/CommunityPrivacyPrivateIcon/';
import { CommunityPrivacyPrivateTitle } from '~/v4/social/elements/CommunityPrivacyPrivateTitle/';
import { CommunityPrivacyPrivateDescription } from '~/v4/social/elements/CommunityPrivacyPrivateDescription';
import { CommunityPrivacyPublicIcon } from '~/v4/social/elements/CommunityPrivacyPublicIcon';
import { CommunityPrivacyPublicTitle } from '~/v4/social/elements/CommunityPrivacyPublicTitle';
import { CommunityPrivacyPublicDescription } from '~/v4/social/elements/CommunityPrivacyPublicDescription';
import { CommunityCreateButton } from '~/v4/social/elements/CommunityCreateButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { isMobile } from '~/v4/social/utils/isMobile';
import { CommunityCoverImage } from '~/v4/social/internal-components/CommunityCoverImage';
import { CreateFormValues, useCreateCommunity } from '~/v4/social/hooks/useCreateCommunity';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CommunityAddMemberTitle } from '~/v4/social/elements/CommunityAddMemberTitle';
import { CommunityAddMemberButton } from '~/v4/social/elements/CommunityAddMemberButton';
import { Input, Label, TextField, TextArea } from 'react-aria-components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import Community from '~/v4/icons/Community';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { Clear } from '~/v4/icons/Clear';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type CreateCommunityProps = {
  mode: AmityCommunitySetupPageMode;
};

export function CreateCommunity({ mode }: CreateCommunityProps) {
  const pageId = 'community_setup_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const MAX_LENGTH_COMMUNITY_NAME = 30;
  const MAX_LENGTH_DESC = 180;

  const { onBack, goToCommunityProfilePage } = useNavigation();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const [incomingImage, setIncomingImage] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<Amity.File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setError, watch, formState, setValue, getValues, control } =
    useCreateCommunity();

  const { errors } = formState;
  const displayName = watch('displayName');
  const description = watch('description');
  const notification = useNotifications();
  const { confirm } = useConfirmContext();

  const { AmityCommunitySetupPageBehavior } = usePageBehavior();

  const handleCoverPhotoChange = (file: File[]) => {
    removeDrawerData();
    if (file.length > 0) {
      setIncomingImage(file);
    }
  };

  const {
    communityName,
    setCommunityName,
    about,
    setAbout,
    categories,
    setCategories,
    setIsPublic,
    isPublic,
    coverImages,
    setCoverImages,
    members,
    setMembers,
  } = useCommunitySetupContext();

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(event.target.value === 'true');
  };

  const onSubmit = async (data: Parameters<typeof CommunityRepository.createCommunity>[0]) => {
    const community = await CommunityRepository.createCommunity(data);
    if (community) {
      notification.success({
        content: 'Successfully created community!',
      });
      goToCommunityProfilePage(community.data.communityId);
    }
  };

  const validateAndSubmit = async (data: CreateFormValues) => {
    try {
      setSubmitting(true);

      if (!data.isPublic && data.userIds?.length === 0) {
        setError('userIds', { message: 'Please select at least one member' });
        return;
      }

      await onSubmit?.({
        ...data,
        avatarFileId: coverImage.length > 0 ? coverImage[coverImage.length - 1].fileId : undefined,
        categoryIds: categories.map((c) => c.categoryId),
        isPublic: isPublic,
        userIds: members && !isPublic ? members.map((m) => m.userId) : undefined,
      });
    } catch (error) {
      notification.info({
        content: 'Failed to create community. Please try again.',
      });
    } finally {
      setSubmitting(false);
      setCoverImages([]);
      setCommunityName('');
      setMembers([]);
      setCategories([]);
      setIsPublic(true);
      setAbout('');
    }
  };

  const disabled = !formState.isValid || submitting || !displayName;

  // to set default value
  useEffect(() => {
    if (communityName && !displayName) {
      setValue('displayName', communityName);
    }
    if (about && !description) {
      setValue('description', about);
    }
    if (categories.length > 0) {
      setCategories(categories);
    }
    if (coverImages.length > 0 && coverImage.length === 0) {
      setCoverImage(coverImages);
    }
  }, []);

  // to update provider value
  useEffect(() => {
    if (displayName && displayName !== communityName) {
      setCommunityName(displayName);
    }
    if (description && description !== about) {
      setAbout(description);
    }
    if (coverImage.length > 0) {
      setCoverImages(coverImage);
    }
    if (description && description !== about) {
      setAbout(description);
    }
    if (isPublic) {
      setMembers([]);
    }
  }, [
    communityName,
    displayName,
    setCommunityName,
    about,
    description,
    setAbout,
    categories,
    setCategories,
    coverImage,
    coverImages,
    setCoverImages,
    isPublic,
  ]);

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.categoryId !== categoryId));
  };

  const handleRemoveUser = (userId: string) => {
    setMembers(members.filter((user) => user.userId !== userId));
  };

  const handleClosePage = () => {
    if (
      communityName ||
      about ||
      categories.length > 0 ||
      coverImage.length > 0 ||
      members.length > 0 ||
      isPublic == false
    ) {
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: 'Leave without finishing?',
        content: 'Your progress won’t be saved and your community won’t be created.',
        onOk: () => {
          setCoverImages([]);
          setCommunityName('');
          setAbout('');
          setCategories([]);
          setMembers([]);
          setIsPublic(true);
          onBack();
          onBack();
        },
        okText: 'Leave',
        cancelText: 'Cancel',
      });
    } else {
      setCoverImages([]);
      setCommunityName('');
      setAbout('');
      setCategories([]);
      setMembers([]);
      setIsPublic(true);
      onBack();
    }
  };

  return (
    <div style={themeStyles} className={styles.createCommunity}>
      <div className={styles.createCommunity__topBar}>
        <CloseButton onPress={handleClosePage} />
        <Title pageId={pageId} titleClassName={styles.createCommunity__title} />
        <div className={styles.createCommunity__emptySpace} />
      </div>
      <form onSubmit={handleSubmit(validateAndSubmit)}>
        <div className={styles.createCommunity__coverImageWrap}>
          <Button
            value="avatarFileId"
            type="button"
            className={styles.createCommunity__coverImageButton}
            onPress={() =>
              setDrawerData({
                content: (
                  <>
                    {isMobile() && (
                      <CameraButton
                        pageId={pageId}
                        onImageFileChange={handleCoverPhotoChange}
                        isVisibleVideo={false}
                        isVisibleImage
                      />
                    )}
                    <ImageButton
                      pageId={pageId}
                      onImageFileChange={handleCoverPhotoChange}
                      isSingleUpload
                    />
                  </>
                ),
              })
            }
          >
            <CommunityCoverImage
              files={incomingImage}
              uploadedFiles={coverImage}
              onChange={({ uploaded, uploading }) => {
                setCoverImage(uploaded);
                setIncomingImage(uploading);
              }}
              uploadLoading={uploadLoading}
              onLoadingChange={setUploadLoading}
              className={styles.createCommunity__coverImage}
            />
            {coverImage.length > 0 && <div className={styles.createCommunity__overlay} />}
            {!uploadLoading && (
              <IconComponent
                defaultIcon={() => <Camera className={styles.createCommunity__cameraIcon} />}
                imgIcon={() => <Camera className={styles.createCommunity__cameraIcon} />}
              />
            )}
          </Button>
        </div>

        <div className={styles.createCommunity__form}>
          <TextField>
            <Label className={styles.createCommunity__label}>
              <CommunityNameTitle pageId={pageId} />
              <Typography.Body className={styles.createCommunity__charactersCount}>
                {displayName.length}/{MAX_LENGTH_COMMUNITY_NAME}
              </Typography.Body>
            </Label>
            <Input
              type="text"
              placeholder="Name your community"
              className={styles.createCommunity__input}
              value={displayName ?? communityName}
              maxLength={MAX_LENGTH_COMMUNITY_NAME}
              required
              {...register('displayName')}
            />
          </TextField>
        </div>
        <div className={styles.createCommunity__form}>
          <TextField>
            <Label className={styles.createCommunity__label}>
              <div className={styles.createCommunity__description}>
                <CommunityAboutTitle pageId={pageId} />
                <Typography.Body className={styles.createCommunity__optionalText}>
                  (Optional)
                </Typography.Body>
              </div>
              <Typography.Body className={styles.createCommunity__charactersCount}>
                {description.length}/{MAX_LENGTH_DESC}
              </Typography.Body>
            </Label>
            <TextArea
              placeholder="Enter description "
              className={styles.createCommunity__textarea}
              value={description}
              maxLength={MAX_LENGTH_DESC}
              {...register('description')}
            />
          </TextField>
        </div>
        <div className={styles.createCommunity__form}>
          <label className={styles.createCommunity__label}>
            <CommunityCategoryTitle pageId={pageId} />
          </label>
          {categories.length > 0 ? (
            <div className={styles.createCommunity__categories}>
              <div className={styles.createCommunity__categoriesWrap}>
                {categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className={styles.createCommunity__selectedCategories}
                  >
                    <div className={styles.createCommunity__selectedCategoryTagAvatar}>
                      <Avatar
                        avatarUrl={category.avatar?.fileUrl}
                        defaultImage={
                          <Community
                            className={styles.createCommunity__selectedCategoryTagAvatarDefault}
                          />
                        }
                      />
                    </div>

                    <Typography.Body className={styles.createCommunity__selectedCategoryName}>
                      {category.name}
                    </Typography.Body>
                    <CloseButton
                      pageId={pageId}
                      onPress={() => handleRemoveCategory(category.categoryId)}
                      defaultClassName={styles.createCommunity__removeCategory}
                    />
                  </div>
                ))}
              </div>
              <Button
                onPress={() => {
                  AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                }}
              >
                <IconComponent
                  defaultIcon={() => (
                    <AngleRight className={styles.createCommunity__categoryIcon} />
                  )}
                  imgIcon={() => <AngleRight className={styles.createCommunity__categoryIcon} />}
                />
              </Button>
            </div>
          ) : (
            <Button
              className={styles.createCommunity__category}
              onPress={() => {
                AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
              }}
            >
              <Typography.Body className={styles.createCommunity__selectedCategory}>
                Select category
                <IconComponent
                  defaultIcon={() => (
                    <AngleRight className={styles.createCommunity__categoryIcon} />
                  )}
                  imgIcon={() => <AngleRight className={styles.createCommunity__categoryIcon} />}
                />
              </Typography.Body>
            </Button>
          )}
        </div>
        <div className={styles.createCommunity__form}>
          <CommunityPrivacyTitle pageId={pageId} />

          <label htmlFor="community-public" className={styles.createCommunity__label}>
            <div className={styles.createCommunity__privacyTitle}>
              <CommunityPrivacyPublicIcon pageId={pageId} />
              <div>
                <CommunityPrivacyPublicTitle pageId={pageId} />
                <CommunityPrivacyPublicDescription pageId={pageId} />
              </div>
            </div>
            <div>
              <Input
                id="community-public"
                className={`${styles.createCommunity__radio} ${styles.createCommunity__hiddenRadio}`}
                type="radio"
                name="privacy"
                checked={isPublic === true}
                onChange={handlePrivacyChange}
                value="true"
                defaultChecked
              />
              <span className={styles.createCommunity__customRadio}></span>
            </div>
          </label>
          <label htmlFor="community-private" className={styles.createCommunity__label}>
            <div className={styles.createCommunity__privacyTitle}>
              <CommunityPrivacyPrivateIcon pageId={pageId} />
              <div>
                <CommunityPrivacyPrivateTitle pageId={pageId} />
                <CommunityPrivacyPrivateDescription pageId={pageId} />
              </div>
            </div>
            <div>
              <Input
                id="community-private"
                className={`${styles.createCommunity__radio} ${styles.createCommunity__hiddenRadio}`}
                type="radio"
                name="privacy"
                checked={isPublic === false}
                onChange={handlePrivacyChange}
                value="false"
              />
              <span className={styles.createCommunity__customRadio} />
            </div>
          </label>
        </div>
        {isPublic === false && (
          <div className={`${styles.createCommunity__form} ${styles.createCommunity__memberWrap}`}>
            <label className={styles.createCommunity__label}>
              <CommunityAddMemberTitle pageId={pageId} />
            </label>
            <div className={styles.createCommunity__selectedUserWrap}>
              {members.map((user) => (
                <div key={user.userId} className={styles.createCommunity__selectedUser}>
                  <div className={styles.createCommunity__selectedUserAvatar}>
                    <UserAvatar
                      userId={user.userId}
                      className={styles.createCommunity__selectedUserAvatarImage}
                    />
                    <Button
                      className={styles.createCommunity__removeUserButton}
                      onPress={() => handleRemoveUser(user.userId)}
                    >
                      <Clear className={styles.createCommunity__removeUser} />
                    </Button>
                  </div>

                  <Typography.Body
                    key={user.userId}
                    className={styles.createCommunity__selectedUserDisplayName}
                  >
                    {user.displayName}
                  </Typography.Body>
                </div>
              ))}
              <CommunityAddMemberButton
                pageId={pageId}
                onPress={() => {
                  AmityCommunitySetupPageBehavior?.goToAddMemberPage?.({ members });
                }}
              />
            </div>
          </div>
        )}

        <div className={styles.createCommunity__createButton}>
          <CommunityCreateButton pageId={pageId} isDisabled={disabled} />
        </div>
      </form>
    </div>
  );
}
