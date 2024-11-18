import React from 'react';
import styles from './MemberTab.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';

type MemberTabProps = {
  pageId?: string;
  activeTab: 'members' | 'moderators';
  onTabChange: (tab: 'members' | 'moderators') => void;
};

export const MemberTab = ({ pageId = '*', activeTab, onTabChange }: MemberTabProps) => {
  const componentId = 'member_tab';
  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  return (
    <div
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.memberTabs__container}
    >
      <Button
        data-qa-anchor={`${accessibilityId}_members`}
        data-is-active={activeTab === 'members'}
        onPress={() => onTabChange('members')}
        className={styles.memberTabs__tab}
      >
        <Typography.Title>Members</Typography.Title>
      </Button>
      <Button
        data-qa-anchor={`${accessibilityId}_moderators`}
        data-is-active={activeTab === 'moderators'}
        onPress={() => onTabChange('moderators')}
        className={styles.memberTabs__tab}
      >
        <Typography.Title>Moderators</Typography.Title>
      </Button>
    </div>
  );
};
