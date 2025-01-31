import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { Typography } from '~/v4/core/components/Typography/TypographyV4';
import { useNotificationData } from '~/v4/core/providers/NotificationProvider';
import styles from './Notification.module.css';

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
  isShowAttributes?: string | boolean;
  onClose?: () => void;
}

export const Notification = ({
  className,
  content,
  icon,
  duration,
  isShowAttributes,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (duration) {
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
  }

  if (!isVisible) return null;

  return (
    isVisible && (
      <div
        data-show-detail-media-attachment={isShowAttributes}
        className={clsx(styles.notificationContainer, className)}
      >
        <div className={clsx(styles.icon__container)}>{icon}</div>{' '}
        {typeof content === 'string' ? <Typography.Body>{content}</Typography.Body> : content}
      </div>
    )
  );
};

export const NotificationsContainer = () => {
  const notifications = useNotificationData();

  return (
    <div className={styles.notifications}>
      {notifications.map((notificationData) => {
        return <Notification {...notificationData} key={notificationData.id} />;
      })}
    </div>
  );
};

export default Notification;
