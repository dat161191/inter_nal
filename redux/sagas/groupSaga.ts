import { put, call, all, takeEvery } from 'redux-saga/effects';
import Api from 'shared/config/api';
import { URL_GROUPS, URL_GROUPS_LOGO } from 'shared/constant/endpoints';
import { Action, ResponseGenerator } from 'types/action';
import { RouterPath } from 'shared/constant/common';
import router from 'next/router';
import { toast } from 'react-toastify';
import { REQUEST, SUCCESS, FAILURE } from '../constants';
import { groupConstants } from '../constants/group';

function* getGroup(action: Action) {
  const { params } = action.payload || {};
  try {
    const groupApi = Api.get(URL_GROUPS, { params });
    const response: ResponseGenerator = yield call(() => groupApi);
    yield put({
      type: SUCCESS(groupConstants.GET_GROUP),
      payload: {
        response: response.data.data,
      },
    });
    router.push({ pathname: RouterPath.Home, query: params }, undefined, { shallow: true });
  } catch (error) {
    yield put({
      type: FAILURE(groupConstants.GET_GROUP),
      error,
    });
  }
}

function* createGroup(action: Action) {
  const { params, callback } = action.payload || {};
  try {
    const param = { name: params.name, description: params.description, type: params.groupType, storedKey: params.groupLogo };
    const response: ResponseGenerator = yield call(Api.post, URL_GROUPS, param);
    toast.success('create success');
    yield put({
      type: SUCCESS(groupConstants.CREATE_GROUP),
    });
    callback?.();
  } catch (error) {
    toast.error('create error');
    yield put({
      type: FAILURE(groupConstants.CREATE_GROUP),
      error,
    });
  }
}
function* getGroupLogo(action: Action) {
  const { params } = action.payload || {};
  try {
    const groupLogoApi = Api.post(URL_GROUPS_LOGO, params, { headers: { 'Content-Type': 'multipart/form-data' } });
    const response: ResponseGenerator = yield call(() => groupLogoApi);
    yield put({
      type: SUCCESS(groupConstants.GET_GROUP_LOGO),
      payload: {
        response: response.data.data.storedKey,
      },
    });
  } catch (error) {
    yield put({
      type: FAILURE(groupConstants.GET_GROUP_LOGO),
      error,
    });
  }
}
function* groupSaga() {
  yield all([takeEvery(REQUEST(groupConstants.GET_GROUP), getGroup)]);
  yield all([takeEvery(REQUEST(groupConstants.CREATE_GROUP), createGroup)]);
  yield all([takeEvery(REQUEST(groupConstants.GET_GROUP_LOGO), getGroupLogo)]);
}

export default groupSaga;
