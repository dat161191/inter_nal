import { Form } from 'types/form';

export const MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';
export const SHORT_ANSWER = 'SHORT_ANSWER';
export const LONG_ANSWER = 'LONG_ANSWER';
export const SELF_REVIEW = 'SELF_REVIEW';
export const CROSS_REVIEW = 'CROSS_REVIEW';
export const TOP_DOWN_REVIEW = 'TOP_DOWN_REVIEW';

export const defaultFormValue: Form = {
  name: '',
  description: '',
  themeColorId: 1,
  fontId: 1,
  formType: SELF_REVIEW,
  assessmentQuestionOptions: [{ assessmentContent: '', questionOptionContents: [], assessmentType: MULTIPLE_CHOICE, required: false }],
};
