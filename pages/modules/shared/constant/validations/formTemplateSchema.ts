import * as Yup from 'yup';
import { RegexCreateGroup } from '../regex/regexCreateGroup';
import { MULTIPLE_CHOICE } from '@/shared/constant/questions';

const createFormTemplateSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .required('form_name_required')
      .max(100, 'form_max_name')
      .matches(RegexCreateGroup.nameRegex, 'form_characters_name'),
    description: Yup.string().trim().required('form_description_required').max(1000, 'form_max_description'),
    formType: Yup.string().required('error_groupType_required'),
    assessmentQuestionOptions: Yup.array().of(
      Yup.object().shape({
        assessmentContent: Yup.string().trim().required('form_content'),
        assessmentType: Yup.string().required('type_is_required'),
        questionOptionContents: Yup.array().when('assessmentType', {
          is: (value: string) => value === MULTIPLE_CHOICE,
          then: Yup.array()
            .of(Yup.string().required('assessment_option').trim())
            .test('unique', 'unique_option', (options: any) => {
              const optionSet = new Set(options);
              return optionSet.size === options?.length && options.length !== 0;
            }),
        }),
      })
    ),
  });
};
export default createFormTemplateSchema;
