import React, { useState } from 'react';
import styles from './UserDescription.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import Truncate from 'react-truncate-markup';
import { Button } from '~/v4/core/natives/Button';

interface UserDescriptionProps {
  description?: string;
  pageId?: string;
  componentId?: string;
}

export const UserDescription: React.FC<UserDescriptionProps> = ({
  description = '',
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'user_description';
  const [isExpanded, setIsExpanded] = useState(false);
  const { isExcluded, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const handleSeeMore = () => {
    setIsExpanded(true);
  };

  if (isExcluded) return null;

  return (
    <div className={styles.userDescription__description} data-qa-anchor={accessibilityId}>
      <Typography.Body>
        {isExpanded ? (
          description
        ) : (
          <Truncate
            lines={4}
            ellipsis={
              <>
                ...
                <Button className={styles.userDescription__seeMore__button} onPress={handleSeeMore}>
                  See more
                </Button>
              </>
            }
          >
            <div>{description}</div>
          </Truncate>
        )}
      </Typography.Body>
    </div>
  );
};
