import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import menuReducer from './reducers/menuReducer';
import groupReducer from './reducers/groupReducer';
import pagesReducer from './reducers/pagesReducer';
import groupDetailReducer from './reducers/groupDetailReducer';
import formReducer from './reducers/formReducer';

const rootReducers = combineReducers({
  authReducer,
  menuReducer,
  groupReducer,
  pagesReducer,
  groupDetailReducer,
  formReducer,
});

export default rootReducers;

export type RootState = ReturnType<typeof rootReducers>;
