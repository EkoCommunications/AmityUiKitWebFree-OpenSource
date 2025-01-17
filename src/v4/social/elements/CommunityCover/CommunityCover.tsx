import React from 'react';
import Lock from '~/v4/icons/Lock';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityProfileMenuButton } from '~/v4/social/elements/CommunityProfileMenuButton';
import styles from './CommunityCover.module.css';

type CommunityCoverProps = {
  image?: string;
  pageId?: string;
  isSticky?: boolean;
  onBack?: () => void;
  componentId?: string;
  onClickMenu?: () => void;
  community?: Amity.Community;
};

export const CommunityCover: React.FC<CommunityCoverProps> = ({
  image,
  onBack,
  isSticky,
  community,
  onClickMenu,
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'community_cover';

  const { isExcluded, accessibilityId, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const backgroundStyle = image
    ? { '--background-image': `url(${image})` }
    : { background: 'linear-gradient(180deg, #a5a9b5 0%, #636878 100%)' };

  return (
    <div
      data-cover-scroll={isSticky}
      data-qa-anchor={accessibilityId}
      className={styles.communityCover__container}
      style={{ ...themeStyles, ...backgroundStyle }}
    >
      <div className={styles.communityCover__topBar}>
        <div className={styles.communityCover__topBarLeft}>
          <BackButton
            onPress={onBack}
            className={styles.communityCover__backButton}
            defaultClassName={styles.communityCover__backButton__icon}
          />
          {isSticky && community && (
            <>
              {!community.isPublic && <Lock className={styles.communityCover__privateIcon} />}
              <Typography.Title className={styles.communityCover__communityName}>
                {community?.displayName}
              </Typography.Title>
              {community?.isOfficial && <CommunityOfficialBadge />}
            </>
          )}
        </div>
        <CommunityProfileMenuButton onPress={onClickMenu} />
      </div>
    </div>
  );
};
