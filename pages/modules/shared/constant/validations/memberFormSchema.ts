import * as yup from 'yup';

const createMemberFormSchema = () => {
  return yup.object({
    positionsForm: yup.object({
      value: yup.string().required('select_field'),
    }),
    membersForm: yup.array().required('select_field').min(1, 'select_field'),
  });
};
export default createMemberFormSchema;
