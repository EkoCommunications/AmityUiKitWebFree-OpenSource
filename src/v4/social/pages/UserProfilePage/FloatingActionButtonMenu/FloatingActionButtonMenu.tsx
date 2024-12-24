import React, { FC, ReactNode } from 'react';
import styles from './FloatingActionButtonMenu.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CreatePost } from '~/v4/icons/CreatePost';
import { CreateStory } from '~/v4/icons/CreateStory';
import CreatePoll from '~/v4/icons/CreatePoll';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';

type FloatingActionButtonMenuProps = {
  onPressMenu?: () => void;
  userId: string;
};

export const FloatingActionButtonMenu: FC<FloatingActionButtonMenuProps> = ({
  userId,
  onPressMenu,
}) => {
  const { goToPostComposerPage, goToPollPostComposerPage } = useNavigation();

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
      onPress: () =>
        goToPostComposerPage({ mode: Mode.CREATE, targetId: null, targetType: 'user' }),
    },
    // {
    //   id: 'story',
    //   label: 'Story',
    //   icon: <CreateStory className={styles.floatingActionButtonMenu__icon} />,
    //   onPress: goToStoryTargetSelectionPage,
    // },
    // s
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
