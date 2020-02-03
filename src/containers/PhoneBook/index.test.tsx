import React from 'react';
import { render } from '@testing-library/react';
import { PhoneBook } from './';

test('renders PhoneBook and checks search box', () => {
  const { getByPlaceholderText } = render(<PhoneBook />);
  const element = getByPlaceholderText(/Search\.\.\./i);
  expect(element).toBeInTheDocument();
  expect(element).toBeDisabled();
});
