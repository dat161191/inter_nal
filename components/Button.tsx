import React from 'react';
import { Spinner } from 'reactstrap';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  colorSpinner?: string;
}

const Button: React.FC<IButtonProps> = ({ isLoading, children, colorSpinner = 'light', ...props }: IButtonProps) => (
  <button {...props} disabled={isLoading || props.disabled} className={props.className}>
    {isLoading && <Spinner color={colorSpinner} size="sm" className="mr-2" />}
    {children}
  </button>
);

export default Button;
