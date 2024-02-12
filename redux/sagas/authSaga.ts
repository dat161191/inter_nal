import { put, call, all, takeEvery } from 'redux-saga/effects';
import Api from 'shared/config/api';
import { URL_GET_ME, URL_LOGIN, URL_LOGOUT } from 'shared/constant/endpoints';
import { CookiesStorage } from 'shared/config/cookie';
import { Action, ResponseGenerator } from 'types/action';
import { authConstants, REQUEST, SUCCESS, FAILURE } from '../constants';
import { ROUTER } from '@/shared/constant/common';

function* login(action: Action) {
  const { params, callback, errorCallback } = action.payload || {};
  try {
    const loginApi = Api.post(URL_LOGIN, params);
    const response: ResponseGenerator = yield call(() => loginApi);
    if (response.data) {
      const { accessToken, refreshToken, roles, expiredIn, userInfo } = response.data.data;
      CookiesStorage.setAccessToken(accessToken);
      CookiesStorage.setRefreshToken(refreshToken);
      yield put({
        type: SUCCESS(authConstants.LOGIN),
        payload: {
          response: {
            roles,
            expiredIn,
            userInfo,
          },
        },
      });
      callback?.(ROUTER.Home);
    }
  } catch (error) {
    yield put({
      type: FAILURE(authConstants.LOGIN),
      error,
    });
    errorCallback?.(error);
  }
}

function* getMe(action: Action) {
  const { callback } = action.payload || {};
  try {
    const apiGetMe = Api.get(URL_GET_ME);
    const response: ResponseGenerator = yield call(() => apiGetMe);
    if (response.data) {
      const userInfo = response.data.data;
      yield put({
        type: SUCCESS(authConstants.GET_ME),
        payload: {
          response: {
            userInfo,
          },
        },
      });
    }
  } catch (error) {
    callback?.();
    yield put({
      type: FAILURE(authConstants.GET_ME),
      error,
    });
  }
}

function* logout(action: Action) {
  const { callback } = action.payload || {};
  try {
    const logoutAPI = Api.get(URL_LOGOUT);
    yield call(() => logoutAPI);
    yield put({
      type: SUCCESS(authConstants.LOGIN),
      payload: {
        response: {},
      },
    });
  } catch (error) {
    yield put({
      type: FAILURE(authConstants.LOGIN),
      error,
    });
  } finally {
    callback?.();
  }
}

function* authSaga() {
  yield all([takeEvery(REQUEST(authConstants.LOGIN), login)]);
  yield all([takeEvery(REQUEST(authConstants.LOGOUT), logout)]);
  yield all([takeEvery(REQUEST(authConstants.GET_ME), getMe)]);
}

export default authSaga;
