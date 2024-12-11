import clsx from 'clsx';
import { CloseButton } from '~/v4/social/elements';
import React, { Fragment, PropsWithChildren } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import styles from './Popup.module.css';

export function Popup() {
  const { popups, closePopup } = usePopupContext();

  return (
    <Fragment>
      {popups.map((popup, index) => {
        const {
          style,
          header,
          onClose,
          children,
          className,
          view = 'all',
          isDismissable = true,
          ...props
        } = popup;
        const close = () => closePopup(props.id);

        return (
          <ModalOverlay
            {...props}
            key={props.id}
            data-view={view}
            className={styles.overlay}
            isDismissable={isDismissable}
            isOpen={index + 1 === popups.length}
            onOpenChange={(open) => (!open && onClose ? onClose({ close }) : close())}
          >
            <Modal className={clsx(styles.popup, className)} style={style}>
              <Dialog className={styles.dialog}>
                {({ close }) => {
                  return (
                    <Fragment>
                      {header && <Popup.Header onClose={close}>{header}</Popup.Header>}
                      {typeof children === 'function' ? children({ close }) : children}
                    </Fragment>
                  );
                }}
              </Dialog>
            </Modal>
          </ModalOverlay>
        );
      })}
    </Fragment>
  );
}

type PopupHeaderProps = PropsWithChildren<{
  pageId?: string;
  onClose?: () => void;
}>;

function PopupHeader({ onClose, children, pageId = '*' }: PopupHeaderProps) {
  return (
    <div className={clsx(styles.popup__header)}>
      {children}
      <CloseButton
        pageId={pageId}
        onPress={onClose}
        defaultClassName={styles.popup__header__closeButton}
      />
    </div>
  );
}

Popup.Header = PopupHeader;
