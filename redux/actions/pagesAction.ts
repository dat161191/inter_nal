import { Payload } from 'types/action';
import { SET_PAGES } from '../constants/pages';

export const setPage = (payload: Payload) => ({
  type: SET_PAGES,
  payload,
});
