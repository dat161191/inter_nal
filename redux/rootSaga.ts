import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import authSaga from 'redux/sagas/authSaga';
import groupSaga from 'redux/sagas/groupSaga';
import groupDetailSaga from './sagas/groupDetailSaga';
import formSaga from './sagas/formSaga';

export const sagaMiddleware = createSagaMiddleware();

export default function* rootSaga() {
  yield all([authSaga(), groupSaga(), groupDetailSaga(), formSaga()]);
}
