import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../components/Button';

const exampleInfo = {
  isLoading: true,
  colorSpinner: '#f4f4f4',
  children: 'button content',
};

describe('Button', () => {
  test('should render correctly loading', () => {
    const { container } = render(<Button {...exampleInfo} />);
    expect(container.querySelector('.sr-only')).toBeTruthy();
  });
  test('should render correctly content', () => {
    const { container, getByText } = render(<Button {...exampleInfo} isLoading={false} />);
    expect(container.querySelector('.sr-only')).toBeFalsy();
    expect(getByText(exampleInfo.children)).toBeTruthy();
  });
});
