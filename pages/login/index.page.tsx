import React, { useMemo, useState } from 'react';
import {
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'i18next-config';
import { yupResolver } from '@hookform/resolvers/yup';
import img360 from 'assets/images/img360.png';
import logoNal from 'assets/images/logoNal.png';
import eye from 'assets/images/icons/eye.svg';
import { toast } from 'react-toastify';
import { CustomToastContainer } from 'pages/modules/custom-toast/cutomToastify';
import Router from 'next/router';
import { LoginForm } from 'types/user';
import { loginUser } from 'redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { EyeOff } from 'react-feather';
import classNames from 'classnames';
import LoginSchema from '../modules/shared/constant/validations/loginSchema';
import HeadHTML from '@/components/headHTML';
import CommonButton from '@/components/Button';
import CInput from '@/components/commonInput';

const Login = () => {
  const schema = LoginSchema();
  const {
    control,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const [t, i18next] = useTranslation('login');
  const [isShowPass, setIsShowPass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.authReducer.isLoading);

  const isDisabled = useMemo(() => {
    const result = !isValid || isSubmitting || isLoading;
    return result;
  }, [isValid, isSubmitting, isLoading]);

  const onSubmit = (data: LoginForm) => {
    if (!isDisabled) {
      dispatch(
        loginUser({
          params: data,
          callback: path => {
            Router.push(path);
          },
          errorCallback: error => {
            if (error.response.status === 400) {
              toast.error(t('login_error'));
            }
          },
        })
      );
    } else {
      toast.warn(t('enter_password_and_email'));
    }
  };

  const changeLanguage = (lng: 'en' | 'ja') => {
    i18next.changeLanguage(lng);
  };

  return (
    <div className="login-container">
      <HeadHTML title="Login" />
      <div className="tranlate-container">
        <UncontrolledButtonDropdown>
          <DropdownToggle>
            <span>{t('translates')}</span>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => changeLanguage('en')}>
              <span>{t('english')}</span>
            </DropdownItem>
            <DropdownItem onClick={() => changeLanguage('ja')}>
              <span>{t('japanese')}</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>

      <div className="login-form-container container">
        <Row className="w-100 h-100 m-0">
          <Col md="7" lg="8" className="d-none d-md-block">
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <div>
                <img src={img360} alt="Image 360" className="login-img" />
              </div>
            </div>
          </Col>

          <Col md="5" lg="4" className="m-0 p-0">
            <div className="d-flex align-items-center justify-content-center w-100 h-100">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex align-items-center justify-content-between logo-nal">
                  <img className="ms-2 logo-nal-img" src={logoNal} alt="Logo Nal" />
                </div>
                <div className="title-group">
                  <p className=" title_review360 mb-1">
                    <b>{t('review360')}</b>
                  </p>
                  <p className="title_login mb-1">
                    <b>{t('title_login')}</b>
                  </p>
                  <p className="title_email_password mb-0">{t('enter_password_and_email')}</p>
                </div>
                <div className="input-email">
                  <CInput
                    name="email"
                    placeholder={t('placeholder_email')}
                    errorsMessage={errors?.email?.message}
                    control={control}
                    label={t('email')}
                  />
                </div>
                <div className="input-password position-relative">
                  <CInput
                    name="password"
                    placeholder={t('placeholder_password')}
                    errorsMessage={errors?.password?.message}
                    control={control}
                    label={t('password')}
                    type={isShowPass === true ? 'text' : 'password'}
                  />
                  <span
                    onClick={() => {
                      setIsShowPass(!isShowPass);
                    }}
                  >
                    {isShowPass ? (
                      <img src={eye} alt="Eye" className="open_eye position-absolute" />
                    ) : (
                      <EyeOff className="close_eye position-absolute" width={18} height={18} />
                    )}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-lg-center mt-2">
                  <CommonButton
                    disabled={isDisabled}
                    className={classNames({
                      'disable-button': isDisabled,
                      'login-button': !isDisabled,
                    })}
                    isLoading={isLoading}
                  >
                    {t('button_login')}
                  </CommonButton>
                </div>
                <div className="pt-1 pb-4">
                  <a className="text-primary forgot_password" onClick={() => setShowModal(!showModal)}>
                    {t('forgot_password')}
                  </a>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </div>

      <CustomToastContainer />
      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
        <ModalHeader toggle={() => setShowModal(!showModal)}>{t('get_password_form')}</ModalHeader>
        <ModalBody>
          <div>
            <Label htmlFor="emailModal">{t('email')}</Label>
            <Input id="emailModal" placeholder={t('placeholder_email')} />
          </div>
        </ModalBody>
        <ModalFooter>
          <CommonButton className="btn btn-secondary" onClick={() => setShowModal(!showModal)}>
            {t('close')}
          </CommonButton>
          <CommonButton
            disabled={isDisabled}
            isLoading={isLoading}
            className="btn btn-primary"
            onClick={() => {
              setShowModal(!showModal);
              toast.success(t('toast_new_password'));
            }}
          >
            {t('get_password')}
          </CommonButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default Login;
