import React from 'react';
import styles from './EmptyContent.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';

interface EmptyContentProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  defaultIcon: () => JSX.Element;
}

export const EmptyContent: React.FC<EmptyContentProps> = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  defaultIcon,
}) => {
  const { config, defaultConfig, isExcluded, themeStyles, accessibilityId, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId} className={styles.emptyContent}>
      <IconComponent
        defaultIcon={defaultIcon}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
      />

      {config.text && (
        <div>
          <Typography.Title className={styles.emptyContent__text}>{config.text}</Typography.Title>
        </div>
      )}
    </div>
  );
};
