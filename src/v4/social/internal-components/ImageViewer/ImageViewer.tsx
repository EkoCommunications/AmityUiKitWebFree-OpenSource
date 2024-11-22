import React, { useState } from 'react';
import useImage from '~/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import styles from './ImageViewer.module.css';
import AngleRight from '~/v4/icons/AngleRight';
import usePost from '~/v4/core/hooks/objects/usePost';

//TODO: After SDK update getPostChildren should be used instead of usePost
interface ImageViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post;
  initialImageIndex: number;
  onClose(): void;
}

export function ImageViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  initialImageIndex,
  onClose,
}: ImageViewerProps) {
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);

  const { post: imagePost } = usePost(post?.children[selectedImageIndex]);

  const imageUrl = useImage({ fileId: imagePost?.data?.fileId });
  const hasNext = selectedImageIndex < post?.children.length - 1;
  const hasPrev = selectedImageIndex > 0;

  const next = () => {
    if (!hasNext) {
      return;
    }
    setSelectedImageIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (!hasPrev) {
      return;
    }
    setSelectedImageIndex((prev) => prev - 1);
  };

  return (
    <div style={themeStyles} data-qa-anchor={accessibilityId}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <img src={imageUrl} alt={imageUrl || ''} className={styles.fullImage} />
          <div className={styles.overlayPanel}>
            {hasPrev && (
              <div className={styles.overlayPanel__prev} onClick={prev}>
                <AngleRight className={styles.overlayPanel__prevButton} />
              </div>
            )}
            <div className={styles.overlayPanel__middle} />
            {hasNext && (
              <div className={styles.overlayPanel__next} onClick={next}>
                <AngleRight className={styles.overlayPanel__nextButton} />
              </div>
            )}
          </div>
          <span className={styles.closeButton}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.imageViewer__clearButton}
              imgClassName={styles.imageViewer__clearButton__img}
              onPress={onClose}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
