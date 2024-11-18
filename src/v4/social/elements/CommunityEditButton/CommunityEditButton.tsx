import React from 'react';
import styles from './CommunityEditButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { Plus } from '~/v4/icons/Plus';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

interface CommunityEditButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: ButtonProps['onPress'];
  isDisabled?: boolean;
}

export const CommunityEditButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
  isDisabled,
}: CommunityEditButtonProps) => {
  const elementId = 'community_edit_button';
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
      className={styles.communityEditButton__button}
      isDisabled={isDisabled}
      type="submit"
    >
      <IconComponent
        defaultIcon={() => <></>}
        imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.image}
        configIconName={config.image}
      />
      <Typography.Body className={styles.communityEditButton__text}>{config.text}</Typography.Body>
    </Button>
  );
};
