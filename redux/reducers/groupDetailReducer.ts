import { Action } from 'types/action';
import { FAILURE, REQUEST, SUCCESS } from '../constants';
import { groupDetail } from '../constants/groupDetail';

const initialState = {
  isLoading: false,
  isError: false,
  error: {},
  member: [],
  isAddMember: false,
};
const groupDetailReducer = (state = initialState, action: Action) => {
  const { payload, error } = action;

  switch (action.type) {
    case REQUEST(groupDetail.GET_GROUP_DETAIL):
      return { ...state, isLoading: true };
    case SUCCESS(groupDetail.GET_GROUP_DETAIL):
      return { ...state, isLoading: false };
    case FAILURE(groupDetail.GET_GROUP_DETAIL):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };
    case FAILURE(groupDetail.GET_MEMBERS):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };
    case FAILURE(groupDetail.GET_MEMBER_NOT_IN_GROUP):
      return {
        ...state,
        isError: true,
        error,
      };
    case FAILURE(groupDetail.GET_POSITION):
      return {
        ...state,
        isError: true,
        error,
      };
    case REQUEST(groupDetail.CREATE_MEMBER):
      return { ...state, isAddMember: true };
    case SUCCESS(groupDetail.CREATE_MEMBER):
      return { ...state, isAddMember: false };
    case FAILURE(groupDetail.CREATE_MEMBER):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
        isAddMember: false,
      };
    default:
      return state;
  }
};
export default groupDetailReducer;
