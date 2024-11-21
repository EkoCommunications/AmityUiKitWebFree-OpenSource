import React, { useEffect, useState } from 'react';
import styles from './EditCommunity.module.css';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { useAmityPage } from '~/v4/core/hooks/uikit';
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
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { isMobile } from '~/v4/social/utils/isMobile';
import { CommunityCoverImage } from '~/v4/social/internal-components/CommunityCoverImage';
import { EditFormValues, useEditCommunity } from '~/v4/social/hooks/useCreateCommunity';
import { Input, Label, TextArea, TextField } from 'react-aria-components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import Community from '~/v4/icons/Community';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityEditTitle } from '~/v4/social/elements/CommunityEditTitle';
import { CommunityEditButton } from '~/v4/social/elements/CommunityEditButton/CommunityEditButton';
import useCategoriesByIds from '~/v4/social/hooks/useCategoriesByIds';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { Category } from '~/v4/icons/Category';

type EditCommunityProps = {
  mode: AmityCommunitySetupPageMode;
  community: Amity.Community;
};

export const EditCommunity = ({ mode, community }: EditCommunityProps) => {
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

  const communityCategories = useCategoriesByIds(community.categoryIds);

  const { register, handleSubmit, setError, watch, formState, setValue, getValues, control } =
    useEditCommunity(community as Amity.Community);

  const notification = useNotifications();

  const displayName = watch('displayName');
  const description = watch('description');

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
  } = useCommunitySetupContext();

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(event.target.value === 'true');
  };

  // to update provider value
  useEffect(() => {
    if (communityName == '' || displayName !== community.displayName) {
      setCommunityName(displayName);
    }
    if (about == '' || description !== community.description) {
      setAbout(description ?? '');
    }
    if (categories.length == 0 && communityCategories.length > 0) {
      setCategories(communityCategories);
    }
    if (community.isPublic == false) {
      setIsPublic(community.isPublic);
    }
  }, [displayName, description, communityCategories, coverImage]);

  const disabled =
    submitting ||
    uploadLoading ||
    !communityName ||
    (communityName === community?.displayName &&
      about === community?.description &&
      coverImage.length === 0 &&
      categories.length === communityCategories.length &&
      categories.sort().every((value, index) => value === communityCategories.sort()[index]) &&
      community.isPublic === isPublic);

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.categoryId !== categoryId));
  };

  const handleClosePage = () => {
    if (
      communityName ||
      about ||
      categories.length > 0 ||
      coverImage.length > 0 ||
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
          setIsPublic(true);
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
      setIsPublic(true);
      onBack();
    }
  };

  const onSubmit = async (data: {
    displayName: string;
    avatarFileId?: string;
    categoryIds?: string[];
    isPublic: boolean;
    description?: string;
    tags?: string[];
  }) => {
    const communities = await CommunityRepository.updateCommunity(community.communityId, data);
    if (!communities) return null;
    if (communities) {
      notification.success({
        content: 'Successfully updated community profile!',
      });
      goToCommunityProfilePage(community.communityId);
    }
  };

  const validateAndSubmit = async (data: EditFormValues) => {
    try {
      setSubmitting(true);

      await onSubmit({
        ...data,
        displayName: communityName,
        avatarFileId: coverImage.length > 0 ? coverImage[coverImage.length - 1].fileId : undefined,
        categoryIds: categories.length > 0 ? categories.map((c) => c.categoryId) : [],
        isPublic,
      });
    } catch (error) {
      notification.info({
        content: 'Failed to update community. Please try again.',
      });
    } finally {
      setSubmitting(false);
      setCoverImages([]);
      setCommunityName('');
      setCategories([]);
      setIsPublic(true);
      setAbout('');
    }
  };

  return (
    <div style={themeStyles} className={styles.editCommunity}>
      <div className={styles.editCommunity__topBar}>
        <CloseButton onPress={handleClosePage} />
        <CommunityEditTitle pageId={pageId} />
        <div />
      </div>
      <form onSubmit={handleSubmit(validateAndSubmit)}>
        <div className={styles.editCommunity__coverImageWrap}>
          <Button
            data-no-image={coverImage.length == 0 || community?.avatarFileId}
            value="avatarFileId"
            type="button"
            className={styles.editCommunity__coverImageButton}
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
              avatarFileId={community?.avatarFileId}
              files={incomingImage}
              uploadedFiles={coverImage}
              onChange={({ uploaded, uploading }) => {
                setCoverImage(uploaded);
                setIncomingImage(uploading);
              }}
              uploadLoading={uploadLoading}
              onLoadingChange={setUploadLoading}
              className={styles.editCommunity__coverImage}
            />
            {coverImage.length > 0 ||
              (community?.avatarFileId && <div className={styles.editCommunity__overlay} />)}
            {!uploadLoading && (
              <IconComponent
                defaultIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                imgIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
              />
            )}
          </Button>
        </div>

        <div className={styles.editCommunity__form}>
          <TextField>
            <Label className={styles.editCommunity__label}>
              <CommunityNameTitle pageId={pageId} />
              <Typography.Body className={styles.editCommunity__charactersCount}>
                {displayName.length}/{MAX_LENGTH_COMMUNITY_NAME}
              </Typography.Body>
            </Label>
            <Input
              aria-label="displayName"
              type="text"
              placeholder="Name your community"
              className={styles.editCommunity__input}
              value={displayName ?? communityName}
              maxLength={MAX_LENGTH_COMMUNITY_NAME}
              required
              {...register('displayName')}
            />
          </TextField>
        </div>
        <div className={styles.editCommunity__form}>
          <TextField>
            <Label className={styles.editCommunity__label}>
              <div className={styles.editCommunity__description}>
                <CommunityAboutTitle pageId={pageId} />
                <Typography.Body className={styles.editCommunity__optionalText}>
                  (Optional)
                </Typography.Body>
              </div>
              <Typography.Body className={styles.editCommunity__charactersCount}>
                {description?.length}/{MAX_LENGTH_DESC}
              </Typography.Body>
            </Label>
            <TextArea
              placeholder="Enter description "
              className={styles.editCommunity__textarea}
              value={description}
              maxLength={MAX_LENGTH_DESC}
              {...register('description')}
            />
          </TextField>
        </div>
        <div className={styles.editCommunity__form}>
          <label className={styles.editCommunity__label}>
            <CommunityCategoryTitle pageId={pageId} />
          </label>
          {categories.length > 0 ? (
            <div className={styles.editCommunity__categories}>
              <div className={styles.editCommunity__categoriesWrap}>
                {categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className={styles.editCommunity__selectedCategories}
                  >
                    <div className={styles.editCommunity__selectedCategoryTagAvatar}>
                      <Avatar
                        avatarUrl={category.avatar?.fileUrl}
                        imgClassName={styles.editCommunity__selectedCategoryTagAvatarDefault}
                        containerClassName={styles.editCommunity__selectedCategoryTagAvatarDefault}
                        defaultImage={
                          <Category
                            className={styles.editCommunity__selectedCategoryTagAvatarDefault}
                          />
                        }
                      />
                    </div>

                    <Typography.Body className={styles.editCommunity__selectedCategoryName}>
                      {category.name}
                    </Typography.Body>
                    <CloseButton
                      pageId={pageId}
                      onPress={() => handleRemoveCategory(category.categoryId)}
                      defaultClassName={styles.editCommunity__removeCategory}
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
                  defaultIcon={() => <AngleRight className={styles.editCommunity__categoryIcon} />}
                  imgIcon={() => <AngleRight className={styles.editCommunity__categoryIcon} />}
                />
              </Button>
            </div>
          ) : (
            <Button
              className={styles.editCommunity__category}
              onPress={() => {
                AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
              }}
            >
              <Typography.Body className={styles.editCommunity__selectedCategory}>
                Select category
                <IconComponent
                  defaultIcon={() => <AngleRight className={styles.editCommunity__categoryIcon} />}
                  imgIcon={() => <AngleRight className={styles.editCommunity__categoryIcon} />}
                />
              </Typography.Body>
            </Button>
          )}
        </div>
        <div className={styles.editCommunity__form}>
          <CommunityPrivacyTitle pageId={pageId} />

          <label htmlFor="community-public" className={styles.editCommunity__label}>
            <div className={styles.editCommunity__privacyTitle}>
              <CommunityPrivacyPublicIcon pageId={pageId} />
              <div>
                <CommunityPrivacyPublicTitle pageId={pageId} />
                <CommunityPrivacyPublicDescription pageId={pageId} />
              </div>
            </div>
            <div>
              <Input
                id="community-public"
                className={`${styles.editCommunity__radio} ${styles.editCommunity__hiddenRadio}`}
                type="radio"
                name="privacy"
                checked={isPublic === true}
                onChange={handlePrivacyChange}
                value="true"
              />
              <span className={styles.editCommunity__customRadio}></span>
            </div>
          </label>
          <label htmlFor="community-private" className={styles.editCommunity__label}>
            <div className={styles.editCommunity__privacyTitle}>
              <CommunityPrivacyPrivateIcon pageId={pageId} />
              <div>
                <CommunityPrivacyPrivateTitle pageId={pageId} />
                <CommunityPrivacyPrivateDescription pageId={pageId} />
              </div>
            </div>
            <div>
              <Input
                id="community-private"
                className={`${styles.editCommunity__radio} ${styles.editCommunity__hiddenRadio}`}
                type="radio"
                name="privacy"
                checked={isPublic === false}
                onChange={handlePrivacyChange}
                value="false"
              />
              <span className={styles.editCommunity__customRadio} />
            </div>
          </label>
        </div>
        <div className={styles.editCommunity__createButton}>
          <CommunityEditButton pageId={pageId} isDisabled={disabled} />
        </div>
      </form>
    </div>
  );
};
