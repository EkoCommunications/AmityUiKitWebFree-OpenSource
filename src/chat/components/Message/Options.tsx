import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { MessageRepository } from '@amityco/ts-sdk';
import { FormattedMessage, useIntl } from 'react-intl';

import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';

import { MessageOptionsIcon, SaveIcon, CloseIcon, EditingInput, EditingContainer } from './styles';
import useMessageFlaggedByMe from '~/chat/hooks/useMessageFlaggedByMe';
import useMessageSubscription from '~/social/hooks/useMessageSubscription';
import { useNotifications } from '~/core/providers/NotificationProvider';

const StyledPopover = styled(Popover)<{ align?: string; className?: string }>`
  ${({ align, theme }) => align === 'end' && `color: ${theme.palette.neutral.main};`}
`;

type FlaggingProps = {
  messageId: string;
};

const Flagging = ({ messageId }: FlaggingProps) => {
  const { isFlaggedByMe, flagMessage, unflagMessage } = useMessageFlaggedByMe(messageId);

  useMessageSubscription({
    messageId,
  });

  return isFlaggedByMe ? (
    <MenuItem onClick={unflagMessage}>
      <FormattedMessage id="message.unflag" />
    </MenuItem>
  ) : (
    <MenuItem onClick={flagMessage}>
      <FormattedMessage id="message.flag" />
    </MenuItem>
  );
};

type OptionsProps = {
  isIncoming: boolean;
  messageId: string;
  data: string | { text: string };
  isSupportedMessageType: boolean;
  popupContainerRef: React.RefObject<HTMLDivElement>;
};

const Options = ({
  isIncoming,
  messageId,
  data,
  isSupportedMessageType,
  popupContainerRef,
}: OptionsProps) => {
  // const popupContainerRef = useRef();
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const notification = useNotifications();

  const edit: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const [isOpen, setIsOpen] = useState(false);

  const { formatMessage } = useIntl();

  const open = () => {
    setText(typeof data === 'object' ? data.text : data);
    setIsOpen(true);
    setIsEditing(false);
  };

  const close = () => {
    setIsOpen(false);
  };

  const save = () => {
    MessageRepository.updateMessage(messageId, { data: { text } })
      .then(close)
      .catch(() => {
        notification.error({
          content: formatMessage({ id: 'message.saveOptionsError' }),
        });
      });
  };

  const deleteMessage = () => {
    MessageRepository.deleteMessage(messageId).then(close);
  };

  const menu = (
    <Menu>
      {!isIncoming && isSupportedMessageType && (
        <MenuItem data-qa-anchor="message-menu-item-edit" onClick={edit}>
          <FormattedMessage id="message.edit" />
        </MenuItem>
      )}
      {isIncoming && <Flagging messageId={messageId} />}
      {!isIncoming && (
        <MenuItem data-qa-anchor="message-menu-item-delete" onClick={deleteMessage}>
          <FormattedMessage id="message.delete" />
        </MenuItem>
      )}
    </Menu>
  );

  const editing = (
    <EditingContainer>
      <EditingInput
        data-qa-anchor="message-edit-input"
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') close();
        }}
      />
      <SaveIcon data-qa-anchor="message-save-button" onClick={save} />
      <CloseIcon onClick={close} />
    </EditingContainer>
  );

  return (
    <StyledPopover
      isOpen={isOpen}
      positions={['bottom', 'top']}
      align={isIncoming ? 'start' : 'end'}
      content={isEditing ? editing : menu}
      parentElement={popupContainerRef?.current || undefined}
      onClickOutside={close}
    >
      <div
        data-qa-anchor="message-options-button"
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={open}
      >
        <MessageOptionsIcon />
      </div>
    </StyledPopover>
  );
};

export default Options;
