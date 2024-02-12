import { PAGE, SORT_TYPE } from './common';

export const DEFAULT_PER_PAGE = 8;
export const POSITION = 'p.id';
export const GROUP_USER = 'gu.id';
export const defaultParamsMembers = {
  keyword: '',
  page: PAGE,
  per_page: DEFAULT_PER_PAGE,
  sort_column: GROUP_USER,
  sort_type: SORT_TYPE.DESC,
};
