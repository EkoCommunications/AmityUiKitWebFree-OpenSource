import React, { ReactNode, useState } from 'react';
import clsx from 'clsx';
import styles from './Notification.module.css';
import { useNotificationData } from '~/v4/core/providers/NotificationProvider';

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
        <div className={clsx(styles.icon__container)}>{icon}</div> {content}
      </div>
    )
  );
};

// rendered by provider, to allow spawning of notification from notification function below
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
