import { Payload } from 'types/action';
import { REQUEST, authConstants } from '../constants';

export const loginUser = (payload: Payload) => ({
  type: REQUEST(authConstants.LOGIN),
  payload,
});

export const getMe = (payload: Payload) => ({
  type: REQUEST(authConstants.GET_ME),
  payload,
});

export const logout = (payload: Payload) => ({
  type: REQUEST(authConstants.LOGOUT),
  payload,
});
