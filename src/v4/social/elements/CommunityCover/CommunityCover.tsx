import React from 'react';
import styles from './CommunityCover.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { CommunityProfileMenuButton } from '~/v4/social/elements/CommunityProfileMenuButton';
import { Typography } from '~/v4/core/components';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';

interface CommunityCoverProps {
  pageId?: string;
  componentId?: string;
  image?: string;
  isSticky?: boolean;
  onBack?: () => void;
  onClickMenu?: () => void;
  community?: Amity.Community;
}

export const CommunityCover: React.FC<CommunityCoverProps> = ({
  pageId = '*',
  componentId = '*',
  image,
  isSticky,
  onBack,
  onClickMenu,
  community,
}) => {
  const elementId = 'community_cover';
  const { isExcluded, accessibilityId, themeStyles, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const backgroundStyle = image
    ? { '--background-image': `url(${image})` }
    : { background: 'linear-gradient(180deg, #a5a9b5 0%, #636878 100%)' };

  if (isExcluded) return null;

  return (
    <div
      data-qa-anchor={accessibilityId}
      data-cover-scroll={isSticky}
      style={{
        ...themeStyles,
        ...backgroundStyle,
      }}
      className={styles.communityCover__container}
    >
      <div className={styles.communityCover__topBar}>
        <div className={styles.communityCover__topBarLeft}>
          <BackButton defaultClassName={styles.communityCover__backButton} onPress={onBack} />
          {isSticky && community && (
            <>
              <Typography.Title className={styles.communityCover__communityName}>
                {community?.displayName}
              </Typography.Title>
              {community?.isOfficial && <CommunityOfficialBadge />}
            </>
          )}
        </div>

        <CommunityProfileMenuButton
          className={styles.communityCover__menuButton}
          onClick={onClickMenu}
        />
      </div>
    </div>
  );
};
