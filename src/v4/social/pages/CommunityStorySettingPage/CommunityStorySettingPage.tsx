import React, { useState } from 'react';
import styles from './CommunityStorySettingPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { BackButton } from '~/v4/social/elements';
import { Label } from 'react-aria-components';
import { Switch } from '~/v4/social/internal-components/Switch/';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type CommunityStorySettingPageProps = {
  community: Amity.Community;
};

export const CommunityStorySettingPage = ({ community }: CommunityStorySettingPageProps) => {
  const pageId = 'community_story_permission_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const { onBack } = useNavigation();

  const [isSelected, setIsSelected] = useState(community?.allowCommentInStory);
  const { info } = useConfirmContext();

  const handleToggleChange = async (selected: boolean) => {
    setIsSelected(selected);
    try {
      await CommunityRepository.updateCommunity(community?.communityId, {
        storySetting: { enableComment: selected },
      });
    } catch (error) {
      info({
        title: 'Failed to update community story permissions. Please try again.',
      });
    }
  };

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.communityStorySettingPage__container}
    >
      <div className={styles.communityStorySettingPage__communityTitleWrap}>
        <BackButton onPress={onBack} />
        <Typography.Title className={styles.communityStorySettingPage__comunityTitle}>
          Story comments
        </Typography.Title>
        <div />
      </div>
      <div className={styles.communityStorySettingPage__wrapLabel}>
        <Label>
          <Typography.Title>Allow comments on community stories</Typography.Title>
          <Typography.Body className={styles.communityStorySettingPage__description}>
            Turn on to receive comments on stories in this community.
          </Typography.Body>
        </Label>
        <Switch value={isSelected ?? true} onChange={handleToggleChange} data-qa-anchor={pageId} />
      </div>
    </div>
  );
};
