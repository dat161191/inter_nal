import { Action } from 'types';
import { SET_PAGES } from '../constants/pages';

const initialState = {
  pages: [],
};
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_PAGES:
      return {
        ...state,
        pages: [...action.payload?.params],
      };
    default:
      return state;
  }
};
export default reducer;
