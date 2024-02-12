import { Action } from 'types/action';
import { authConstants } from '../constants/auth';
import { FAILURE, REQUEST, SUCCESS } from '../constants';

const initialState = {
  isLoading: false,
  isError: false,
  error: {},
  type: '',
  roles: [],
  expiredIn: 0,
  userInfo: {},
};

const reducer = (state = initialState, action: Action) => {
  const { payload, error } = action;
  const { roles, expiredIn, userInfo } = payload?.response || {};
  switch (action.type) {
    case REQUEST(authConstants.LOGIN):
      return {
        ...state,
        isLoading: true,
        type: action.type,
        messageError: '',
      };
    case SUCCESS(authConstants.LOGIN):
      return {
        ...state,
        isLoading: false,
        roles,
        expiredIn,
        userInfo,
      };
    case SUCCESS(authConstants.GET_ME):
      return {
        ...state,
        isLoading: false,
        userInfo,
        roles: userInfo.roles,
      };
    case FAILURE(authConstants.LOGIN):
      return {
        ...state,
        isLoading: false,
        isError: true,
        roles: [],
        expiredIn: 0,
        userInfo: {},
        error,
      };
    case FAILURE(authConstants.GET_ME):
      return {
        ...state,
        isLoading: false,
        isError: true,
        userInfo: {},
        roles: [],
        error,
      };
    default:
      return state;
  }
};

export default reducer;
