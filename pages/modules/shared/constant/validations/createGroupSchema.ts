import * as Yup from 'yup';
import { RegexCreateGroup } from '../regex/regexCreateGroup';

const CreateGroupSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .required('error_name_required')
      .max(55, 'max_name')
      .matches(RegexCreateGroup.nameRegex, 'special_characters_name'),
    description: Yup.string().trim().required('error_description_required').max(5000, 'max_description'),
    groupType: Yup.string().required('error_groupType_required'),
  });
};
export default CreateGroupSchema;
