import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Close } from '~/icons';

export const CloseIcon = styled(Close).attrs<{ icon?: ReactNode }>({ width: 18, height: 18 })`
  padding: 0 6px;
  cursor: pointer;
  margin-left: auto;
  &.svg-inline--fa {
    width: auto;
  }
`;

export const Overlay = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  padding: 20px 0;
  background: rgba(23, 24, 28, 0.8);
  animation-duration: 0.3s;
  animation-name: appear;
  margin-top: 0 !important;

  @keyframes appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const ModalWindow = styled.div`
  margin: auto;
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 6px;
  max-width: 520px;
  min-width: 360px;
  ${({ theme }) => theme.typography.body}
  color: ${({ theme }) => theme.palette.neutral.main};

  &:focus {
    outline: none;
  }

  @media (max-width: 520px) {
    width: 95vw;
    min-width: unset;
  }
`;

const SmallModalWindow = styled(ModalWindow)`
  width: 440px;
`;

export const StyledModalWindow = ({
  small,
  ...props
}: React.ComponentPropsWithRef<typeof ModalWindow> & { small?: boolean }) => {
  if (small) {
    return <SmallModalWindow {...props} />;
  }
  return <ModalWindow {...props} />;
};

export const Header = styled.div<{ clean?: boolean }>`
  padding: 16px 16px 12px 16px;
  ${({ clean, theme }) =>
    !clean &&
    css`
      border-bottom: 1px solid ${theme.palette.base.shade4};
    `};
  ${({ theme }) => theme.typography.title};
  display: flex;
  align-items: center;
`;

export const Content = styled.div<{ isText?: boolean }>`
  ${({ isText }) =>
    isText &&
    css`
      padding: 20px 16px;
    `}
`;

export const Footer = styled.div<{ clean?: boolean }>`
  padding: 16px 12px;
  padding-top: 4px;
  ${({ clean, theme }) =>
    !clean &&
    css`
      border-top: 1px solid ${theme.palette.base.shade4};
      padding-top: 16px;
    `}
`;
