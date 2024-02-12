import React, { useEffect, useState } from 'react';
import Link from 'next/dist/client/link';
import { useTranslation } from 'i18next-config';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledButtonDropdown,
} from 'reactstrap';
import { Form } from 'types/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Router, useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/mainLayout';
import createFormTemplateSchema from '@/validations/formTemplateSchema';
import Back from '@/assets/images/icons/back.svg';
import { PageTitle, RouterPath } from '@/shared/constant/common';
import QuestionBox from './questionBox';
import { CROSS_REVIEW, SELF_REVIEW, TOP_DOWN_REVIEW, defaultFormValue } from '@/shared/constant/questions';
import { setPage } from '@/redux/actions/pagesAction';
import withAuth from '@/pages/modules/shared/hoc/withAuth';
import { RootState } from '@/redux/rootReducer';
import { createForm } from '@/redux/actions/formActions';

const Forms = () => {
  const [t] = useTranslation('home');
  const validationSchema = createFormTemplateSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm({
    defaultValues: defaultFormValue,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  const { isLoading } = useSelector((state: RootState) => state.formReducer);
  const { fields, remove, insert, update } = useFieldArray({ control, name: 'assessmentQuestionOptions' });
  const formType = watch('formType');
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = (data: Form) => {
    dispatch(
      createForm({
        params: data,
        callback: () => {
          toast.success(t('create_form_success'));
          router.push(RouterPath.FormTemplates);
        },
        errorCallback: () => {
          toast.error(t('create_form_error'));
        },
      })
    );
  };

  const setFormType = (type: string) => {
    setValue('formType', type);
  };

  useEffect(() => {
    dispatch(setPage({ params: [PageTitle.FormTemplateList, PageTitle.FormAdd] }));
  }, []);

  return (
    <MainLayout title="form_add">
      <div className="content mt-3">
        <div className="container-fluid">
          <Link href={RouterPath.FormTemplates}>
            <div className="ml-2 box-back-btn">
              <img className="back-btn" src={Back} alt="back" /> <p className="back-text">{t('add_new_form')}</p>
            </div>
          </Link>
          <div className="form-create-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="title-form">{t('add_new_form')}</p>
              <Row className="box-add-question">
                <Col xs={12} sm={6} md={6} lg={6} className="add-question">
                  <p>{t('add_questions')}</p>
                </Col>
                <Col sm={6} md={6} lg={6} className="send-to">
                  <p>{t('send_to')}</p>
                </Col>
              </Row>
              <div className="position-relative">
                <input className="input-form-name" {...register('name')} type="text" placeholder={t('form_name')} />
                <div className="ml-3 mh-0">{errors.name && <span className="color-message">{t(errors.name.message || '')}</span>}</div>
              </div>
              <div>
                <textarea className="form-description" {...register('description')} placeholder={t('form_description')} />
                <div className="ml-3 mh-0">
                  {errors.description && <span className="color-message">{t(errors.description.message || '')}</span>}
                </div>
              </div>
              <div className="box-type-select">
                <UncontrolledButtonDropdown>
                  <DropdownToggle tag="a">
                    <div className="type-form-check">{t(formType || '')}</div>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setFormType(CROSS_REVIEW)}>
                      <span>{t(CROSS_REVIEW)}</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => setFormType(TOP_DOWN_REVIEW)}>
                      <span>{t(TOP_DOWN_REVIEW)}</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => setFormType(SELF_REVIEW)}>
                      <span>{t(SELF_REVIEW)}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              {fields.map((field: any, index: number) => (
                <div key={field.id}>
                  <QuestionBox
                    control={control}
                    length={fields.length}
                    register={register}
                    errors={errors}
                    removeOption={remove}
                    updateOption={update}
                    watch={watch}
                    insert={insert}
                    indexOption={index}
                    assessmentQuestionOptions={field}
                  />
                </div>
              ))}
              <div className="box-submit-form">
                <Link href={RouterPath.FormTemplates}>
                  <button type="button" className="btn cancel-btn padding-btn-form">
                    {t('cancel')}
                  </button>
                </Link>
                <button type="submit" className="btn submit-btn btn-danger padding-btn-form">
                  <span>{t('save')}</span>
                  {isLoading && <Spinner size="sm" className="ml-2" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default withAuth(Forms);
