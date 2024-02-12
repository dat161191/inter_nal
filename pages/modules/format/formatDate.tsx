import { format, isValid } from 'date-fns';

export const formatDate = (date: string, formatString: string) => {
  if (!date) return '-';

  const parsedDate = new Date(date);
  if (isValid(parsedDate)) {
    return format(parsedDate, formatString);
  }
  return '-';
};
