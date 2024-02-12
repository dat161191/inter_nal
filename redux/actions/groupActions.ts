import { REQUEST } from 'redux/constants';
import { groupConstants } from 'redux/constants/group';
import { Action, Payload } from 'types/action';

export const getGroup = (payload: Payload): Action => ({
  type: REQUEST(groupConstants.GET_GROUP),
  payload,
});
export const showMore = (payload: Payload): Action => ({
  type: REQUEST(groupConstants.SHOW_MORE),
  payload,
});
export const getGroupLogo = (payload: Payload): Action => ({
  type: REQUEST(groupConstants.GET_GROUP_LOGO),
  payload,
});
export const createGroup = (payload: Payload): Action => ({
  type: REQUEST(groupConstants.CREATE_GROUP),
  payload,
});
