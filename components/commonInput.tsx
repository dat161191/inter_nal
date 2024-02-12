import React from 'react';
import { Input, Label } from 'reactstrap';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { InputType } from 'reactstrap/es/Input';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder?: string;
  errorsMessage?: string;
  type?: InputType;
  control?: Control<FieldValues>;
  defaultValue?: string;
  onChange?: (val: any) => void;
  label?: string;
}

const uniqueId = uuidv4();

const CInput = ({ errorsMessage, control, name, onChange, ...props }: IInputProps) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Label className="m-0" for={uniqueId}>
              {props.label}
            </Label>
            <Input
              id={uniqueId}
              {...field}
              {...props}
              onChange={newValue => {
                field.onChange(newValue);
                onChange?.(newValue);
              }}
            />
          </>
        )}
      />
      <div className="message-error">{errorsMessage || ''}</div>
    </>
  );
};
export default CInput;
