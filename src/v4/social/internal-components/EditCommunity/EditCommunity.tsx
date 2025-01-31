import React, { useEffect, useState } from 'react';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton, CloseButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityNameTitle } from '~/v4/social/elements/CommunityNameTitle';
import { Button } from '~/v4/core/natives/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { Camera } from '~/v4/icons/Camera';
import { Avatar, Typography } from '~/v4/core/components';
import { CommunityAboutTitle } from '~/v4/social/elements/CommunityAboutTitle';
import { CommunityCategoryTitle } from '~/v4/social/elements/CommunityCategoryTitle';
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
import { FileTrigger, Input, Label, TextArea, TextField } from 'react-aria-components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityEditTitle } from '~/v4/social/elements/CommunityEditTitle';
import { CommunityEditButton } from '~/v4/social/elements/CommunityEditButton/CommunityEditButton';
import useCategoriesByIds from '~/v4/social/hooks/useCategoriesByIds';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { Category } from '~/v4/icons/Category';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ChevronTop } from '~/v4/icons/ChevronTop';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import ChevronRight from '~/v4/icons/ChevronRight';
import { CommunityAddCategoryPage } from '~/v4/social/pages';
import styles from './EditCommunity.module.css';
import { Popover } from '~/v4/core/components/AriaPopover';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';

type EditCommunityProps = {
  community: Amity.Community;
  mode: AmityCommunitySetupPageMode;
};

export const EditCommunity = ({ mode, community }: EditCommunityProps) => {
  const MAX_LENGTH_DESC = 180;
  const MAX_LENGTH_COMMUNITY_NAME = 30;
  const pageId = 'community_setup_page';

  const { isDesktop } = useResponsive();
  const notification = useNotifications();
  const { confirm } = useConfirmContext();
  const { themeStyles } = useAmityPage({ pageId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { onBack, goToCommunityProfilePage } = useNavigation();
  const { AmityCommunitySetupPageBehavior } = usePageBehavior();
  const communityCategories = useCategoriesByIds(community.categoryIds);
  const { register, handleSubmit, setError, watch, formState, setValue, getValues, control } =
    useEditCommunity(community as Amity.Community);

  const [submitting, setSubmitting] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [incomingImage, setIncomingImage] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<Amity.File[]>([]);

  const {
    about,
    isPublic,
    setAbout,
    categories,
    setIsPublic,
    setCategories,
    communityName,
    setCoverImages,
    setCommunityName,
  } = useCommunitySetupContext();

  const displayName = watch('displayName');
  const description = watch('description');

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

  const handleCoverPhotoChange = (file: File[]) => {
    removeDrawerData();
    if (file.length > 0) setIncomingImage(file);
  };

  const handlePrivacyChange = (value: string) => setIsPublic(value === 'true');

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
        content: 'Successfully updated community profile.',
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

  return (
    <div style={themeStyles} className={styles.editCommunity}>
      <div className={styles.editCommunity__topBar}>
        {isDesktop ? (
          <BackButton pageId={pageId} onPress={handleClosePage} />
        ) : (
          <CloseButton onPress={handleClosePage} />
        )}
        <CommunityEditTitle pageId={pageId} className={styles.editCommunity__title} />
        <div className={styles.editCommunity__emptySpace} />
      </div>
      <form onSubmit={handleSubmit(validateAndSubmit)} className={styles.editCommunity__form}>
        {isDesktop ? (
          <FileTrigger
            allowsMultiple={false}
            acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
            onSelect={(files) => {
              if (!files || files.length === 0) return;
              const fileArray = Array.from(files);
              handleCoverPhotoChange(fileArray);
            }}
          >
            <Button
              type="button"
              value="avatarFileId"
              aria-label="Upload cover image"
              className={styles.editCommunity__coverImageButton}
              data-no-image={coverImage.length == 0 || community?.avatarFileId}
            >
              <CommunityCoverImage
                files={incomingImage}
                uploadedFiles={coverImage}
                uploadLoading={uploadLoading}
                onLoadingChange={setUploadLoading}
                avatarFileId={community?.avatarFileId}
                onChange={({ uploaded, uploading }) => {
                  setCoverImage(uploaded);
                  setIncomingImage(uploading);
                }}
              />
              {coverImage.length > 0 ||
                (community?.avatarFileId && <div className={styles.editCommunity__overlay} />)}
              {!uploadLoading && (
                <IconComponent
                  imgIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                  defaultIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                />
              )}
            </Button>
          </FileTrigger>
        ) : (
          <Button
            type="button"
            value="avatarFileId"
            className={styles.editCommunity__coverImageButton}
            data-no-image={coverImage.length == 0 || community?.avatarFileId}
            onPress={() =>
              setDrawerData({
                content: (
                  <>
                    {isMobile() && (
                      <CameraButton
                        isVisibleImage
                        pageId={pageId}
                        isVisibleVideo={false}
                        onImageFileChange={handleCoverPhotoChange}
                      />
                    )}
                    <ImageButton
                      isSingleUpload
                      pageId={pageId}
                      onImageFileChange={handleCoverPhotoChange}
                    />
                  </>
                ),
              })
            }
          >
            <CommunityCoverImage
              files={incomingImage}
              uploadedFiles={coverImage}
              uploadLoading={uploadLoading}
              onLoadingChange={setUploadLoading}
              avatarFileId={community?.avatarFileId}
              onChange={({ uploaded, uploading }) => {
                setCoverImage(uploaded);
                setIncomingImage(uploading);
              }}
            />
            {coverImage.length > 0 ||
              (community?.avatarFileId && <div className={styles.editCommunity__overlay} />)}
            {!uploadLoading && (
              <IconComponent
                imgIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
                defaultIcon={() => <Camera className={styles.editCommunity__cameraIcon} />}
              />
            )}
          </Button>
        )}
        <div className={styles.editCommunity__formContent}>
          <TextField>
            <Label className={styles.editCommunity__label}>
              <CommunityNameTitle pageId={pageId} />
              <Typography.Body className={styles.editCommunity__charactersCount}>
                {displayName.length}/{MAX_LENGTH_COMMUNITY_NAME}
              </Typography.Body>
            </Label>
            <Input
              required
              type="text"
              aria-label="displayName"
              placeholder="Name your community"
              value={displayName ?? communityName}
              maxLength={MAX_LENGTH_COMMUNITY_NAME}
              className={styles.editCommunity__input}
              {...register('displayName')}
            />
          </TextField>
        </div>
        <div className={styles.editCommunity__formContent}>
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
              value={description}
              maxLength={MAX_LENGTH_DESC}
              placeholder="Enter description"
              className={styles.editCommunity__textarea}
              {...register('description')}
            />
          </TextField>
        </div>
        <div className={styles.editCommunity__formContent}>
          <label className={styles.editCommunity__label}>
            <CommunityCategoryTitle pageId={pageId} />
          </label>
          <Popover
            trigger={({ isDesktop, isOpen, openPopover }) => {
              const arrowIcon = isDesktop ? (
                isOpen ? (
                  <ChevronTop className={styles.editCommunity__categoryIcon} />
                ) : (
                  <ChevronDown className={styles.editCommunity__categoryIcon} />
                )
              ) : (
                <ChevronRight className={styles.editCommunity__categoryIcon} />
              );
              return categories.length > 0 ? (
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
                            containerClassName={
                              styles.editCommunity__selectedCategoryTagAvatarDefault
                            }
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
                          defaultClassName={styles.editCommunity__removeCategory}
                          onPress={() => handleRemoveCategory(category.categoryId)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onPress={() => {
                      isDesktop
                        ? openPopover()
                        : AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                    }}
                  >
                    <IconComponent defaultIcon={() => arrowIcon} imgIcon={() => arrowIcon} />
                  </Button>
                </div>
              ) : (
                <Button
                  className={styles.editCommunity__category}
                  onPress={() => {
                    isDesktop
                      ? openPopover()
                      : AmityCommunitySetupPageBehavior?.goToAddCategoryPage?.({ categories });
                  }}
                >
                  <Typography.Body className={styles.editCommunity__selectedCategory}>
                    Select category
                    <IconComponent defaultIcon={() => arrowIcon} imgIcon={() => arrowIcon} />
                  </Typography.Body>
                </Button>
              );
            }}
          >
            <CommunityAddCategoryPage />
          </Popover>
        </div>
        <RadioGroup
          onChange={handlePrivacyChange}
          value={isPublic ? 'true' : 'false'}
          labelClassName={styles.editCommunity__label}
          className={styles.editCommunity__formContent}
          label={<CommunityPrivacyTitle pageId={pageId} />}
          radioProps={{ className: styles.editCommunity__formRadio }}
          radios={[
            {
              value: 'true',
              label: (
                <div className={styles.editCommunity__privacy}>
                  <CommunityPrivacyPublicIcon pageId={pageId} />
                  <div>
                    <CommunityPrivacyPublicTitle pageId={pageId} />
                    <CommunityPrivacyPublicDescription pageId={pageId} />
                  </div>
                </div>
              ),
            },
            {
              value: 'false',
              label: (
                <div className={styles.editCommunity__privacy}>
                  <CommunityPrivacyPrivateIcon pageId={pageId} />
                  <div>
                    <CommunityPrivacyPrivateTitle pageId={pageId} />
                    <CommunityPrivacyPrivateDescription pageId={pageId} />
                  </div>
                </div>
              ),
            },
          ]}
        />
        <div className={styles.editCommunity__createButton}>
          <CommunityEditButton pageId={pageId} isDisabled={disabled} />
        </div>
      </form>
    </div>
  );
};
