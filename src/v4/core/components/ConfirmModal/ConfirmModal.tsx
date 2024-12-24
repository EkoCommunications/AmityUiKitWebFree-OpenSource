import clsx from 'clsx';
import React, { Fragment, ReactNode } from 'react';
import { CloseButton } from '~/v4/social/elements';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components/Typography';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { ConfirmType, useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import styles from './ConfirmModal.module.css';

type ConfirmProps = ConfirmType & {
  isOpen: boolean;
  className?: string;
  okText?: ReactNode;
  cancelText?: ReactNode;
  type?: 'confirm' | 'info';
};

const Confirm = ({
  onOk,
  title,
  isOpen,
  content,
  onCancel,
  className,
  pageId = '*',
  okText = 'Ok',
  type = 'confirm',
  componentId = '*',
  cancelText = 'Cancel',
  retryText,
}: ConfirmProps) => {
  const elementId = 'confirm-modal';
  const { accessibilityId, themeStyles } = useAmityElement({ pageId, componentId, elementId });

  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={onCancel}
      className={clsx(styles.overlay)}
      data-qa-anchor={`${elementId}-${accessibilityId}`}
    >
      <Modal className={clsx(styles.popup, className)}>
        <Dialog className={styles.dialog}>
          {({ close }) => {
            return (
              <Fragment>
                <div className={clsx(styles.popup__header)}>
                  <Typography.Title
                    className={styles.popup__header__title}
                    data-qa-anchor={`${pageId}/${componentId}/modal-title`}
                  >
                    {title}
                  </Typography.Title>
                  <CloseButton
                    pageId={pageId}
                    onPress={close}
                    defaultClassName={styles.popup__header__closeButton}
                  />
                </div>
                <div
                  className={clsx(styles.popup__content)}
                  data-qa-anchor={`${pageId}/${componentId}/modal-content`}
                >
                  {content}
                </div>
                <div className={styles.popup__footer}>
                  {type === 'confirm' && (
                    <Button
                      size="medium"
                      color="secondary"
                      variant="outlined"
                      onPress={onCancel}
                      style={themeStyles}
                      data-qa-anchor={`${elementId}-cancel-button`}
                      className={styles.popup__footer__cancelButton}
                    >
                      <Typography.BodyBold>{cancelText}</Typography.BodyBold>
                    </Button>
                  )}
                  <Button
                    size="medium"
                    variant="fill"
                    onPress={onOk}
                    style={themeStyles}
                    className={styles.popup__footer__okButton}
                    color={type === 'info' ? 'primary' : 'alert'}
                    data-qa-anchor={`${elementId}-${accessibilityId}-ok-button`}
                  >
                    <Typography.BodyBold>{okText}</Typography.BodyBold>
                  </Button>
                </div>
              </Fragment>
            );
          }}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export const ConfirmModal = () => {
  const { confirmData, closeConfirm } = useConfirmContext();

  if (!confirmData) return null;

  const onCancel = () => {
    closeConfirm();
    confirmData?.onCancel?.();
  };

  const onOk = () => {
    closeConfirm();
    confirmData?.onOk?.();
  };

  return <Confirm {...confirmData} onOk={onOk} onCancel={onCancel} isOpen={!!confirmData} />;
};

export default Confirm;
