import React from 'react';
import styles from './Members.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import { Members as MembersIcon } from '~/v4/icons/Members';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components/Typography';
import AngleRight from '~/v4/icons/AngleRight';

type MembersProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const Members = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: MembersProps) => {
  const elementId = 'members';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.members__button}
    >
      <div className={styles.members__leftWrap}>
        <IconComponent
          defaultIcon={() => (
            <MembersIcon className={clsx(styles.members__icon, defaultIconClassName)} />
          )}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIconName={defaultConfig.icon}
          configIconName={config.icon}
        />
        {config.text && <Typography.Body>{config.text}</Typography.Body>}
      </div>
      <div>
        <AngleRight className={styles.members__angleRight} />
      </div>
    </Button>
  );
};
