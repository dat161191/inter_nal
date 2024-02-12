import * as yup from 'yup';
import { useTranslation } from 'i18next-config';
import { RegexLogin } from '../regex/regexLogin';

const MAX_LENGHT = 255;

const LoginSchema = () => {
  const [t] = useTranslation('login');
  return yup.object().shape({
    email: yup
      .string()
      .trim()
      .required(t('required', { field: t('email') }))
      .max(MAX_LENGHT, t('max_length', { field: t('email'), maxLength: t('num_max_lenght') }))
      .matches(RegexLogin.emailRegex, t('invalid', { field: t('email') })),
    password: yup
      .string()
      .trim()
      .required(t('required', { field: t('password') })),
  });
};
export default LoginSchema;
