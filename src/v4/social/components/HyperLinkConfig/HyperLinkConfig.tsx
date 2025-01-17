import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { custom, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import Trash from '~/v4/social/icons/trash';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { DoneButton } from '~/v4/social/elements/DoneButton';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton';

import styles from './HyperLinkConfig.module.css';
import Close from '~/v4/icons/Close';
import { Button } from '~/v4/core/natives/Button/Button';
import { UnderlineInput } from '~/v4/social/internal-components/UnderlineInput/UnderlineInput';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';

interface HyperLinkConfigProps {
  pageId: string;
  url?: string;
  customText?: string;
  onClose: () => void;
  onSubmit: (data: { url: string; customText?: string }) => void;
  onRemove: () => void;
  openBottomSheetChange?: (isOpen: boolean) => void;
}

const MAX_LENGTH = 30;

export const HyperLinkConfig = ({
  pageId = '*',
  url,
  customText,
  onClose,
  onSubmit,
  onRemove,
  openBottomSheetChange,
}: HyperLinkConfigProps) => {
  const componentId = 'hyper_link_config_component';
  const { confirm } = useConfirmContext();
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { closePopup } = usePopupContext();

  if (isExcluded) return null;

  const { client } = useSDK();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const formId = 'asc-story-hyperlink-form';

  const schema = z.object({
    url: z
      .string()
      .refine(
        (value) => {
          if (!value) return true;
          try {
            const urlObj = new URL(value);
            return ['http:', 'https:'].includes(urlObj.protocol);
          } catch (error) {
            // Check if the value starts with "www."
            if (value.startsWith('www.')) {
              try {
                const urlObj = new URL(`https://${value}`);
                return ['http:', 'https:'].includes(urlObj.protocol);
              } catch (error) {
                return false;
              }
            }
            return false;
          }
        },
        {
          message: 'Please enter a valid URL.',
        },
      )
      .refine(
        async (value) => {
          if (!value) return true;
          // Prepend "https://" to the value if it starts with "www."
          const urlToValidate = value.startsWith('www.') ? `https://${value}` : value;
          const hasWhitelistedUrls = await client?.validateUrls([urlToValidate]).catch(() => false);
          return hasWhitelistedUrls;
        },
        {
          message: 'Please enter a whitelisted URL.',
        },
      ),
    customText: z
      .string()
      .optional()
      .refine(async (value) => {
        if (!value) return true;
        const hasBlockedWord = await client?.validateTexts([value]).catch(() => false);
        return hasBlockedWord;
      }, 'Your text contains a blocklisted word.'),
  });

  type HyperLinkFormInputs = z.infer<typeof schema>;

  const {
    trigger,
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HyperLinkFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      url,
      customText,
    },
  });

  useEffect(() => {
    setHasUnsavedChanges(url !== '' || customText !== '');
  }, [url, customText]);

  const onSubmitForm = (data: HyperLinkFormInputs) => {
    onSubmit(data);
    onClose();
  };

  const confirmDiscardHyperlink = () => {
    // TODO: fix cannot close drawer
    reset();
    onRemove();
    onClose();
  };

  const discardHyperlink = () => {
    openBottomSheetChange?.(false);
    confirm({
      title: 'Remove Link',
      content: 'This link will be removed from story.',
      cancelText: 'Cancel',
      okText: 'Remove',
      onOk: confirmDiscardHyperlink,
      onCancel: () => {
        openBottomSheetChange?.(true);
      },
    });
  };

  const handleClose = () => {
    openBottomSheetChange?.(false);
    if (hasUnsavedChanges) {
      confirm({
        title: 'Unsaved changes',
        content: `Are you sure you want to cancel? Your changes won't be saved.`,
        cancelText: 'No',
        okText: 'Yes',
        onCancel: () => {
          openBottomSheetChange?.(true);
        },
        onOk: () => {
          reset();
          closePopup();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles}>
      <div className={styles.headerContainer}>
        <EditCancelButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleClose}
          className={styles.hyperlinkConfig__header__editCancelButton}
        />
        <Typography.Title>Add link</Typography.Title>
        <DoneButton
          type="submit"
          pageId={pageId}
          componentId={componentId}
          form={formId}
          className={styles.hyperlinkConfig__header__editDoneButton}
        />
        <Button onPress={handleClose} className={styles.hyperlinkConfig__header__closeButton}>
          <Close className={styles.hyperlinkConfig__header__closeButton__icon} />
        </Button>
      </div>
      <div className={styles.divider} />
      <div className={styles.hyperlinkFormContainer}>
        <form onSubmit={handleSubmit(onSubmitForm)} id={formId} className={styles.form}>
          <UnderlineInput
            label="URL"
            required={true}
            placeholder="https://example.com"
            value={watch('url')}
            {...register('url', {
              onChange: () => trigger('url'),
            })}
            {...{ id: 'asc-uikit-hyperlink-input-url' }}
            isError={!!errors.url?.message}
            helperText={errors?.url?.message}
          />
          <UnderlineInput
            label="Customize link text"
            placeholder="Name your link"
            {...register('customText')}
            {...{ id: 'asc-uikit-hyperlink-input-link-text' }}
            isError={!!errors.customText?.message}
            helperText={
              errors?.customText?.message ?? 'This text will show on the link instead of URL.'
            }
            value={watch('customText')}
            showCounter={true}
            maxLength={MAX_LENGTH}
          />
        </form>
        {url && (
          <div className={styles.removeLinkContainer}>
            <Button onPress={discardHyperlink} className={clsx(styles.removeLinkButton)}>
              <Trash className={styles.removeIcon} />
              Remove link
            </Button>
          </div>
        )}
      </div>
      <div className={styles.hyperlinkConfig__footer}>
        <EditCancelButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleClose}
          className={styles.hyperlinkConfig__footer__editCancelButton}
        />
        <DoneButton
          type="submit"
          pageId={pageId}
          componentId={componentId}
          form={formId}
          className={styles.hyperlinkConfig__footer__editDoneButton}
        />
      </div>
    </div>
  );
};
