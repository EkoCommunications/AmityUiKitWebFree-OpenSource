import React, { useCallback, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentList } from '~/v4/social/components/CommentList';
import { CommentComposer } from '~/v4/social/components/CommentComposer';
import styles from './CommentTray.module.css';

type CommentTrayProps = {
  pageId?: string;
  referenceId: string;
  community: Amity.Community;
  shouldAllowCreation?: boolean;
  shouldAllowInteraction: boolean;
  referenceType: Amity.CommentReferenceType;
};

export const CommentTray = ({
  referenceId,
  pageId = '*',
  referenceType,
  shouldAllowCreation = true,
  shouldAllowInteraction = true,
  community = {} as Amity.Community,
}: CommentTrayProps) => {
  const componentId = 'comment_tray_component';

  const [replyTo, setReplyTo] = useState<Amity.Comment | null>(null);
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

  const onCancelReply = useCallback(() => () => setReplyTo(null), []);
  const onClickReply = useCallback(() => (comment: Amity.Comment) => setReplyTo(comment), []);

  return (
    <div
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.commentTrayContainer}
    >
      <div className={styles.commentListContainer}>
        <CommentList
          includeDeleted
          pageId={pageId}
          community={community}
          referenceId={referenceId}
          onClickReply={onClickReply}
          referenceType={referenceType}
          shouldAllowInteraction={shouldAllowInteraction}
        />
      </div>
      {shouldAllowInteraction && (
        <CommentComposer
          referenceId={referenceId}
          onCancelReply={onCancelReply}
          referenceType={referenceType}
          replyTo={replyTo as Amity.Comment}
          shouldAllowCreation={shouldAllowCreation}
        />
      )}
    </div>
  );
};
