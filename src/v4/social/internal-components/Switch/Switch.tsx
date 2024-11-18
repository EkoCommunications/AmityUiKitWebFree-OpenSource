import React from 'react';
import styles from './Switch.module.css';
import { Input, Label } from 'react-aria-components';

interface SwitchProps {
  disabled?: boolean;
  value: boolean;
  onChange?: (value: boolean) => void;
  'data-qa-anchor'?: string;
}

export const Switch = ({
  disabled,
  value,
  onChange = () => {},
  'data-qa-anchor': dataQaAnchor = '',
  ...props
}: SwitchProps) => {
  return (
    <Label className={styles.switch__label} {...props} data-qa-anchor={`${dataQaAnchor}_label`}>
      <Input
        type="checkbox"
        className={styles.switch__input}
        checked={value}
        data-qa-anchor={`${dataQaAnchor}_switch`}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className={styles.switch__slider} />
    </Label>
  );
};
