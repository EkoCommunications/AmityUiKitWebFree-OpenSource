import React, { FC, ReactNode } from 'react';
import styles from './FloatingActionButtonMenu.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CreatePost } from '~/v4/icons/CreatePost';
import { CreateStory } from '~/v4/icons/CreateStory';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type FloatingActionButtonMenuProps = {
  onPressMenu?: () => void;
};

export const FloatingActionButtonMenu: FC<FloatingActionButtonMenuProps> = ({ onPressMenu }) => {
  const { goToSelectPostTargetPage, goToStoryTargetSelectionPage } = useNavigation();

  const menus: {
    id: string;
    label: string;
    icon: ReactNode;
    onPress: () => void;
  }[] = [
    {
      id: 'post',
      label: 'Post',
      icon: <CreatePost className={styles.floatingActionButtonMenu__icon} />,
      onPress: goToSelectPostTargetPage,
    },
    // {
    //   id: 'story',
    //   label: 'Story',
    //   icon: <CreateStory className={styles.floatingActionButtonMenu__icon} />,
    //   onPress: goToStoryTargetSelectionPage,
    // },
  ];
  return (
    <div className={styles.floatingActionButtonMenu}>
      {menus.map((menu) => (
        <Button
          key={menu.id}
          className={styles.floatingActionButtonMenu__button}
          onPress={() => {
            onPressMenu?.();
            menu.onPress();
          }}
        >
          {menu.icon}
          <Typography.BodyBold className={styles.floatingActionButtonMenu__label}>
            {menu.label}
          </Typography.BodyBold>
        </Button>
      ))}
    </div>
  );
};
