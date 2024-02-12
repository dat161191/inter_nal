import { REQUEST } from 'redux/constants';
import { Payload } from 'types/action';
import { groupDetail } from '../constants/groupDetail';

export const getGroupDetail = (payload: Payload) => ({
  type: REQUEST(groupDetail.GET_GROUP_DETAIL),
  payload,
});

export const getMembers = (payload: Payload) => ({
  type: REQUEST(groupDetail.GET_MEMBERS),
  payload,
});
export const getMembersForm = (payload: Payload) => ({
  type: REQUEST(groupDetail.GET_MEMBER_NOT_IN_GROUP),
  payload,
});
export const addMember = (payload: Payload) => ({
  type: REQUEST(groupDetail.CREATE_MEMBER),
  payload,
});
export const getPositions = (payload: Payload) => ({
  type: REQUEST(groupDetail.GET_POSITION),
  payload,
});
