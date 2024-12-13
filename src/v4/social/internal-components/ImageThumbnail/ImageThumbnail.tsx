import React from 'react';
import styles from './ImageThumbnail.module.css';
import { CloseIcon, ExclamationCircle } from '~/icons';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import useFileUpload from '~/v4/social/hooks/useFileUpload';
import { FileRepository } from '@amityco/ts-sdk';
import { Button } from '~/v4/core/natives/Button';

interface ImageThumbnailProps {
  pageId?: string;
  componentId?: string;
  files: File[];
  uploadedFiles: Amity.File[];
  onChange: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  onLoadingChange: (loading: boolean) => void;
  uploadLoading: boolean;
  onError: (message: string) => void;
  isErrorUpload?: string;
  onUploadFailed?: (message: string) => void;
}

export function ImageThumbnail({
  pageId = '*',
  componentId = '*',
  files,
  uploadedFiles,
  onChange,
  onLoadingChange,
  uploadLoading,
  onError,
  isErrorUpload,
}: ImageThumbnailProps) {
  const useFileUploadProps = useFileUpload({
    files,
    uploadedFiles,
    onChange,
    onLoadingChange,
    onError,
  });

  const { allFiles, removeFile } = useFileUploadProps;

  if (allFiles.length === 0) return null;

  return (
    allFiles && (
      <div
        data-images-amount={Math.min(allFiles.length, 3)}
        className={styles.thumbnail__container}
      >
        {allFiles?.map((file, index: number) => (
          <div
            key={index}
            data-images-height={allFiles.length > 2}
            className={styles.thumbnail__wrapper}
          >
            {uploadLoading ? (
              <>
                <img src={URL.createObjectURL(file as File)} className={styles.thumbnail} alt="" />
                <div className={styles.thumbnail__overlay} />
                <div className={styles.icon__status}>
                  <Spinner />
                </div>
              </>
            ) : isErrorUpload ? (
              <div className={styles.icon__status}>
                <ExclamationCircle />
              </div>
            ) : (
              <>
                <img
                  data-qa-anchor={`${pageId}/${componentId}/image_thumbnail`}
                  className={styles.thumbnail}
                  src={FileRepository.fileUrlWithSize((file as Amity.File)?.fileUrl, 'medium')}
                  alt={(file as Amity.File).attributes?.name}
                />
                <Button
                  data-qa-anchor={`${pageId}/${componentId}/remove_thumbnail`}
                  type="reset"
                  className={styles.closeButton}
                  onPress={() => removeFile(file)}
                >
                  <CloseIcon className={styles.closeIcon} />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    )
  );
}
