import React from 'react';
import styles from './CommunityCreateButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { Plus } from '~/v4/icons/Plus';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

interface CommunityCreateButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: ButtonProps['onPress'];
  isDisabled?: boolean;
}

export const CommunityCreateButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
  isDisabled,
}: CommunityCreateButtonProps) => {
  const elementId = 'community_create_button';
  const { config, accessibilityId, themeStyles, isExcluded, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      onPress={onPress}
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.communityCreateButton__button}
      isDisabled={isDisabled}
      type="submit"
    >
      <IconComponent
        defaultIcon={() => (
          <Plus className={clsx(styles.communityCreateButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.image}
        configIconName={config.image}
      />
      <Typography.Body className={styles.communityCreateButton__text}>
        {config.text}
      </Typography.Body>
    </Button>
  );
};
