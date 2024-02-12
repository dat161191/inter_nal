import { all, call, put, takeEvery } from 'redux-saga/effects';
import { Action, ResponseGenerator } from 'types/action';
import { FAILURE, REQUEST, SUCCESS } from '../constants';
import Api from '@/shared/config/api';
import { groupDetail } from '../constants/groupDetail';
import { URL_GROUPS_DETAIL, URL_GROUPS_ID_MEMBERS, URL_MEMBERS, URL_MEMBER_OPTIONS, URL_POSITION } from '@/shared/constant/endpoints';

function* getGroupDetail(action: Action) {
  const { params, callback, errorCallback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(() => Api.get(URL_GROUPS_DETAIL(params.id)));
    yield put({
      type: SUCCESS(groupDetail.GET_GROUP_DETAIL),
    });
    callback?.({ data: response.data.data });
  } catch (error) {
    yield put({
      type: FAILURE(groupDetail.GET_GROUP_DETAIL),
      error,
    });
    errorCallback?.({ error });
  }
}
function* getMembers(action: Action) {
  const { params, callback, errorCallback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(() =>
      Api.get(URL_MEMBERS(params.groupId), {
        params: params.params,
      })
    );
    yield put({
      type: SUCCESS(groupDetail.GET_MEMBERS),
    });
    callback?.({
      data: response.data.data,
      pathname: URL_GROUPS_DETAIL(params.groupId),
      query: params.params,
    });
  } catch (error) {
    yield put({
      type: FAILURE(groupDetail.GET_MEMBERS),
      error,
    });
    errorCallback?.({ error });
  }
}
function* getMembersOption(action: Action) {
  const { params, callback, errorCallback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(() => Api.get(URL_MEMBER_OPTIONS(params.groupId), { params }));
    callback?.({ data: response.data.data });
  } catch (error) {
    yield put({
      type: FAILURE(groupDetail.GET_MEMBER_NOT_IN_GROUP),
      error,
    });
    errorCallback?.({ error });
  }
}
function* getPositions(action: Action) {
  const { callback, errorCallback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(() => Api.get(URL_POSITION));
    callback?.({ data: response.data.data });
  } catch (error) {
    yield put({ type: FAILURE(groupDetail.GET_POSITION), error });
    errorCallback?.({ error });
  }
}
function* addNewMember(action: Action) {
  const { params, callback, errorCallback } = action.payload || {};
  try {
    const response: ResponseGenerator = yield call(() => Api.post(URL_GROUPS_ID_MEMBERS(params.groupId), params));
    yield put({ type: SUCCESS(groupDetail.CREATE_MEMBER) });
    callback?.();
  } catch (error) {
    yield put({ type: FAILURE(groupDetail.CREATE_MEMBER), error });
    errorCallback?.({ error });
  }
}
function* groupDetailSaga() {
  yield all([takeEvery(REQUEST(groupDetail.GET_GROUP_DETAIL), getGroupDetail)]);
  yield all([takeEvery(REQUEST(groupDetail.GET_MEMBERS), getMembers)]);
  yield all([takeEvery(REQUEST(groupDetail.GET_MEMBER_NOT_IN_GROUP), getMembersOption)]);
  yield all([takeEvery(REQUEST(groupDetail.GET_POSITION), getPositions)]);
  yield all([takeEvery(REQUEST(groupDetail.CREATE_MEMBER), addNewMember)]);
}
export default groupDetailSaga;
