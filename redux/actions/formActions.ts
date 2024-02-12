import { Payload } from 'types/action';
import { REQUEST } from '../constants';
import { formConstants } from '../constants/form';

export const createForm = (payload: Payload) => ({
  type: REQUEST(formConstants.CREATE),
  payload,
});
export const getFormTemplate = (payload: Payload) => ({
  type: REQUEST(formConstants.GET_FORM_TEMPLATE),
  payload,
});
export const deleteFormTemplate = (payload: Payload) => ({
  type: REQUEST(formConstants.DELETE_FORM_TEMPLATE),
  payload,
});
