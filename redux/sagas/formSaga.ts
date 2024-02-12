import { put, call, all, takeEvery } from 'redux-saga/effects';
import Api from 'shared/config/api';
import { URL_FORM, URL_FORM_DELETE } from 'shared/constant/endpoints';
import { ResponseGenerator } from 'types/action';
import { Action } from '../../types';
import { FAILURE, REQUEST, SUCCESS } from '../constants';
import { formConstants } from '../constants/form';

function* create(action: Action) {
  const { callback, params, errorCallback } = action.payload || {};
  try {
    yield call(Api.post, URL_FORM, params);
    yield put({
      type: SUCCESS(formConstants.CREATE),
    });
    callback?.();
  } catch (error: any) {
    if (error.response.status === 400) errorCallback?.();
    yield put({
      type: FAILURE(formConstants.CREATE),
    });
  }
}

function* getFormTemplate(action: Action) {
  const { params, callback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(Api.get, URL_FORM, { params });
    yield put({
      type: SUCCESS(formConstants.GET_FORM_TEMPLATE),
      payload: {
        response: response.data.data,
      },
    });
    callback?.(response.data.data.items);
  } catch (error) {
    yield put({
      type: FAILURE(formConstants.GET_FORM_TEMPLATE),
      error,
    });
  }
}

function* deleteFormTemplate(action: Action) {
  const { params, callback, errorCallback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(Api.delete, URL_FORM_DELETE(params));
    yield put({
      type: SUCCESS(formConstants.DELETE_FORM_TEMPLATE),
    });
    callback?.();
  } catch (error) {
    if (error.response.status === 400) errorCallback?.();
    yield put({
      type: FAILURE(formConstants.DELETE_FORM_TEMPLATE),
      error,
    });
  }
}

function* formSaga() {
  yield all([takeEvery(REQUEST(formConstants.CREATE), create)]);
  yield all([takeEvery(REQUEST(formConstants.GET_FORM_TEMPLATE), getFormTemplate)]);
  yield all([takeEvery(REQUEST(formConstants.DELETE_FORM_TEMPLATE), deleteFormTemplate)]);
}

export default formSaga;
