import clsx from 'clsx';
import React from 'react';
import { Radio, RadioProps } from '~/v4/core/components/AriaRadio/Radio';
import { FieldError, RadioGroup as $RadioGroup, Label } from 'react-aria-components';
import type { RadioGroupProps as $RadioGroupProps, ValidationResult } from 'react-aria-components';
import styles from './RadioGroup.module.css';

type RadioGroupProps = $RadioGroupProps & {
  labelClassName?: string;
  radioProps?: Partial<RadioProps>;
  label?: string | React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  radios: { value: string; label: string | React.ReactNode; props?: Partial<RadioProps> }[];
};

export function RadioGroup({
  label,
  radios,
  className,
  radioProps,
  errorMessage,
  labelClassName,
  ...props
}: RadioGroupProps) {
  return (
    <$RadioGroup {...props} className={clsx(styles.radioGroup, className)}>
      {label && <Label className={labelClassName}>{label}</Label>}
      {radios.map(({ value, label, props }) => (
        <Radio {...radioProps} {...props} value={value} key={value} label={label} />
      ))}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </$RadioGroup>
  );
}
