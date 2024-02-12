import { Group } from 'types/group';
import { REQUEST, SUCCESS, FAILURE } from '../constants/actionType';
import { groupConstants } from '../constants/group';
import { Action } from '../../types/action';

const initialState = {
  isLoading: false,
  isError: false,
  error: {},
  type: '',
  next: null,
  groups: [],
  storedKey: '',
};
const reducer = (state = initialState, action: Action) => {
  const { payload, error } = action;
  switch (action.type) {
    case REQUEST(groupConstants.GET_GROUP):
      return {
        ...state,
        isLoading: true,
      };
    case REQUEST(groupConstants.SHOW_MORE):
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS(groupConstants.GET_GROUP):
      return {
        ...state,
        isLoading: false,
        groups: payload?.response.items,
        next: payload?.response.pagination.next,
      };
    case FAILURE(groupConstants.GET_GROUP):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
        groups: [],
      };
    case REQUEST(groupConstants.CREATE_GROUP):
      return {
        ...state,
        isLoading: true,
      };
    case FAILURE(groupConstants.CREATE_GROUP):
      return {
        ...state,
        isError: true,
      };
    case SUCCESS(groupConstants.CREATE_GROUP):
      return {
        ...state,
        isError: true,
        storedKey: '',
      };
    case REQUEST(groupConstants.GET_GROUP_LOGO):
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS(groupConstants.GET_GROUP_LOGO):
      return {
        ...state,
        isLoading: false,
        storedKey: payload?.response,
      };
    case FAILURE(groupConstants.GET_GROUP_LOGO):
      return {
        ...state,
        isError: true,
        storedKey: '',
      };
    default:
      return state;
  }
};
export default reducer;
