import clsx from 'clsx';
import React, { ReactNode, useRef, createElement, DOMAttributes } from 'react';
import { useButton, AriaButtonOptions } from 'react-aria';
import styles from './ClickableArea.module.css';

export type ClickableAreaProps<T extends 'span' | 'div'> = Omit<
  AriaButtonOptions<T>,
  'elementType'
> & {
  elementType: 'span' | 'div';
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function ClickableArea<T extends 'span' | 'div'>({
  className,
  style,
  ...props
}: ClickableAreaProps<T>): React.DetailedReactHTMLElement<
  {
    className: string | undefined;
    ref: React.MutableRefObject<HTMLButtonElement | null>;
  } & DOMAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  const { children } = props;
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(props, ref);

  const element = createElement(
    props.elementType,
    { ...buttonProps, className: clsx(styles.clickableArea, className), ref, style },
    children,
  );

  return element;
}
