import React from 'react';
import { ControllerProps, Controller } from 'react-hook-form';
import Select, { OptionsOrGroups } from 'react-select';
import { Label } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';

interface ISeclectProps extends Omit<ControllerProps<any>, 'render'> {
  options?: OptionsOrGroups<any, never>;
  label?: string;
  errorMessage?: string;
  isMutil?: boolean;
  onChange?: (val: any) => void;
}
const uniqueId = uuidv4();

export const CSelect = ({ errorMessage, name, control, isMutil = false, onChange, ...props }: ISeclectProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      return (
        <>
          <Label className="m-0" for={uniqueId}>
            {props.label}
          </Label>
          <Select
            id={uniqueId}
            {...field}
            {...props}
            isMulti={isMutil}
            onChange={newValue => {
              field.onChange(newValue);
              onChange?.(newValue);
            }}
          />
          <div className="message-error">{errorMessage || ''}</div>
        </>
      );
    }}
  />
);
