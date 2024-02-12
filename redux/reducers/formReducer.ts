import { Action } from 'types/action';
import { formConstants } from '../constants/form';
import { FAILURE, REQUEST, SUCCESS } from '../constants';

const initialState = {
  isLoading: false,
  isError: false,
  type: '',
  error: {},
  next: null,
};

const reducer = (state = initialState, action: Action) => {
  const { error, payload } = action;
  switch (action.type) {
    case REQUEST(formConstants.CREATE):
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };
    case SUCCESS(formConstants.CREATE):
      return {
        ...state,
        isLoading: false,
        type: action.type,
      };
    case FAILURE(formConstants.CREATE):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };
    case REQUEST(formConstants.GET_FORM_TEMPLATE):
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };
    case SUCCESS(formConstants.GET_FORM_TEMPLATE):
      return {
        ...state,
        isLoading: false,
        next: payload?.response.pagination.next,
      };
    case FAILURE(formConstants.GET_FORM_TEMPLATE):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };

    case REQUEST(formConstants.DELETE_FORM_TEMPLATE):
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS(formConstants.DELETE_FORM_TEMPLATE):
      return {
        ...state,
        isLoading: false,
      };
    case FAILURE(formConstants.DELETE_FORM_TEMPLATE):
      return {
        ...state,
        isLoading: false,
        isError: true,
        error,
      };

    default:
      return state;
  }
};

export default reducer;
