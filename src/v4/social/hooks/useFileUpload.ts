import { useState, useCallback, useEffect, useMemo } from 'react';
import { FileRepository, FileType } from '@amityco/ts-sdk';
import { isNonNullable } from '~/helpers/utils';

export function isAmityFile(file: Amity.File | File): file is Amity.File {
  return (file as Amity.File).fileId !== undefined;
}

export const getUpdatedTime = (file: File | Amity.File) => {
  if (!isAmityFile(file)) return file.lastModified;
  return file.updatedAt ? new Date(file.updatedAt).getTime() : Date.now();
};

export default function useFileUpload({
  files = [],
  uploadedFiles = [],
  onChange = (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => {},
  onLoadingChange = (loading: boolean) => {},
  onError = (message: string) => {},
}: {
  files?: Iterable<File> | Array<File>;
  uploadedFiles: Amity.File[];
  onChange?: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (message: string) => void;
}) {
  const [rejected, setRejected] = useState<string[]>([]); // filenames that has loading error

  const fileList = useMemo(() => (Array.isArray(files) ? files : Array.from(files)), [files]);

  const reset = useCallback(() => {
    onChange({
      uploaded: [],
      uploading: [],
    });
  }, [onChange]);

  const retry = useCallback(() => {
    setRejected([]);
  }, []);

  const removeFile = useCallback(
    (file: Amity.File | File, index?: number) => {
      if (isAmityFile(file)) {
        const remaining = uploadedFiles.filter((item) => item.fileId !== file.fileId);
        onChange({
          uploaded: remaining,
          uploading: fileList,
        });
      } else if (index !== undefined) {
        const remaining = uploadedFiles.filter((_, i) => i !== index);

        onChange({
          uploaded: remaining,
          uploading: fileList,
        });
      } else {
        const remaining = fileList.filter((item) => item.name !== file.name);
        onChange({
          uploaded: uploadedFiles,
          uploading: remaining,
        });
      }
    },
    [onChange, uploadedFiles, fileList],
  );

  // file upload function
  useEffect(() => {
    if (!fileList.length) return;

    async function run() {
      onLoadingChange(true);
      try {
        const updatedFiles = await Promise.all(
          fileList.map(async (file: File) => {
            const formData: FormData = new FormData();
            formData.append('files', file);
            const uploadedFile = await (async () => {
              if (file.type.includes(FileType.IMAGE)) {
                return FileRepository.createImage(formData);
              } else if (file.type.includes(FileType.VIDEO)) {
                return FileRepository.createVideo(formData);
              }
            })();

            if (uploadedFile && uploadedFile.data.length > 0) {
              return uploadedFile.data[0];
            }

            return null;
          }),
        );

        const updated = [...uploadedFiles, ...updatedFiles].filter(isNonNullable);
        onChange({
          uploaded: updated,
          uploading: [],
        });
        setRejected([]);
        // TODO: fix type
      } catch (e: any) {
        setRejected(fileList.map((file) => file.name));
        e.message && onError(e.message ?? '');
      } finally {
        onLoadingChange(false);
      }
    }

    run();
  }, [fileList]);

  const allFiles = [...uploadedFiles, ...fileList];

  return {
    allFiles,
    uploading: fileList,
    uploaded: uploadedFiles,
    removeFile,
    reset,
    rejected,
    retry,
  };
}
