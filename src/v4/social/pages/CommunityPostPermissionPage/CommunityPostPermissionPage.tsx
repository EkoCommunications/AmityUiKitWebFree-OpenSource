import React, { useEffect, useState } from 'react';
import styles from './CommunityPostPermissionPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button/Button';
import { Input, Label } from 'react-aria-components';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CommunityPostSettings } from '@amityco/ts-sdk';

type CommunityPostPermissionPageProps = {
  community: Amity.Community;
};

//TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
export const CommunityPostPermissionPage = ({ community }: CommunityPostPermissionPageProps) => {
  const pageId = 'community_post_permission_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const { onBack, onClickCommunity } = useNavigation();
  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const defaultPostSetting = community.postSetting
    ? community.postSetting
    : (community as Amity.Community & { needApprovalOnPostCreation?: boolean })
          .needApprovalOnPostCreation
      ? CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED
      : (community as Amity.Community & { onlyAdminCanPost?: boolean }).onlyAdminCanPost
        ? CommunityPostSettings.ONLY_ADMIN_CAN_POST
        : CommunityPostSettings.ANYONE_CAN_POST;

  const [postSetting, setPostSetting] =
    useState<ValueOf<typeof CommunityPostSettings>>(defaultPostSetting);

  useEffect(() => {
    setPostSetting(defaultPostSetting);
  }, [defaultPostSetting]);

  const handleSubmitPermission = async () => {
    let payload;

    if (postSetting === CommunityPostSettings.ONLY_ADMIN_CAN_POST) {
      payload = { postSetting: CommunityPostSettings.ONLY_ADMIN_CAN_POST };
    } else if (postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) {
      payload = { postSetting: CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED };
    } else {
      payload = { postSetting: CommunityPostSettings.ANYONE_CAN_POST };
    }
    try {
      await CommunityRepository.updateCommunity(community?.communityId, payload);
    } catch (error) {
      notification.error({
        content: 'Failed to update community profile!',
      });
    } finally {
      notification.success({
        content: 'Successfully updated community profile!',
      });
      onClickCommunity(community?.communityId);
    }
  };

  const confirmPageChange = () => {
    if (community?.postSetting !== postSetting) {
      confirm({
        title: 'Discard changes',
        content: 'Are you sure you want to discard changes?',
        onOk: () => {
          onBack();
        },
      });
    } else {
      onBack();
    }
  };

  const disabled = defaultPostSetting === postSetting;

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.communityPostPermissionPage__container}
    >
      <div className={styles.communityPostPermissionPage__communityTitleWrap}>
        <BackButton onPress={confirmPageChange} />
        <Typography.Title className={styles.communityPostPermissionPage__comunityTitle}>
          Post permissions
        </Typography.Title>
        <Button
          className={styles.communityPostPermissionPage__save}
          onPress={handleSubmitPermission}
          isDisabled={disabled}
        >
          Save
        </Button>
      </div>
      <div className={styles.communityPostPermissionPage__label}>
        <Typography.BodyBold>Who can post on this community</Typography.BodyBold>
        <br />
        <Typography.Body className={styles.communityPostPermissionPage__desc}>
          You can control who can create posts in your community.
        </Typography.Body>
      </div>

      <Label htmlFor="everyoneCanPost" className={styles.communityPostPermissionPage__choiceWrap}>
        <Typography.Body>Everyone can post</Typography.Body>
        <Input
          id="everyoneCanPost"
          className={`${styles.communityPostPermissionPage__radio} ${styles.communityPostPermissionPage__hiddenRadio}`}
          type="radio"
          name="postPermission"
          checked={postSetting === CommunityPostSettings.ANYONE_CAN_POST}
          onChange={() => setPostSetting(CommunityPostSettings.ANYONE_CAN_POST)}
        />
        <span className={styles.communityPostPermissionPage__customRadio} />
      </Label>

      <Label htmlFor="adminReviewPost" className={styles.communityPostPermissionPage__choiceWrap}>
        <Typography.Body>Admin review post</Typography.Body>

        <Input
          id="adminReviewPost"
          className={`${styles.communityPostPermissionPage__radio} ${styles.communityPostPermissionPage__hiddenRadio}`}
          type="radio"
          name="postPermission"
          checked={postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED}
          onChange={() => setPostSetting(CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED)}
        />
        <span className={styles.communityPostPermissionPage__customRadio} />
      </Label>

      <Label htmlFor="onlyAdminCanPost" className={styles.communityPostPermissionPage__choiceWrap}>
        <Typography.Body>Only admins can post</Typography.Body>

        <Input
          id="onlyAdminCanPost"
          className={`${styles.communityPostPermissionPage__radio} ${styles.communityPostPermissionPage__hiddenRadio}`}
          type="radio"
          name="postPermission"
          checked={postSetting === CommunityPostSettings.ONLY_ADMIN_CAN_POST}
          onChange={() => setPostSetting(CommunityPostSettings.ONLY_ADMIN_CAN_POST)}
        />
        <span className={styles.communityPostPermissionPage__customRadio} />
      </Label>
    </div>
  );
};
