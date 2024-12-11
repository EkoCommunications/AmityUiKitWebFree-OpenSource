import clsx from 'clsx';
import React from 'react';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button/Button';
import styles from './BackButton.module.css';

interface BackButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress?: ButtonProps['onPress'];
}

export const BackButton = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
}: BackButtonProps) => {
  const elementId = 'back_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      data-qa-anchor={accessibilityId}
      className={styles.backButton}
      onPress={onPress}
      style={themeStyles}
      aria-label="Back"
    >
      <IconComponent
        defaultIcon={() => (
          <ArrowLeft className={clsx(styles.backButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
};
