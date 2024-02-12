import React, { useEffect, useMemo, useState } from 'react';
import { FormGroup, Input, Label, Row, Col } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/dist/client/link';
import { useDispatch, useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'i18next-config';
import { CustomToastContainer } from 'pages/modules/custom-toast/cutomToastify';
import FormData from 'form-data';
import withAuth from 'pages/modules/shared/hoc/withAuth';
import MainLayout from '@/components/layout/mainLayout';
import { HEIGHT_AVATAR, MAX_FILE_SIZE, PageTitle, RouterPath, WIDTH_AVATAR } from '../../shared/constant/common';
import { createGroup, getGroupLogo } from '@/redux/actions/groupActions';
import { RootState } from '@/redux/rootReducer';
import CreateGroupSchema from '../modules/shared/constant/validations/createGroupSchema';
import GroupType from '../modules/shared/constant/group-type/groupType';
import Button from '@/components/Button';
import { ADMIN, BOD } from '@/redux/constants';
import { setPage } from '@/redux/actions/pagesAction';

const Group = () => {
  const router = useRouter();
  const [groupLogo, setLogo] = useState('');
  const dispatch = useDispatch();
  const [groupType, setGroupType] = useState(GroupType());
  const { roles, isLoading } = useSelector((state: RootState) => state.authReducer);
  const [t] = useTranslation('home');
  const { storedKey } = useSelector((state: RootState) => state.groupReducer);

  useEffect(() => {
    dispatch(setPage({ params: [PageTitle.Grouplist, PageTitle.AddNewGroup] }));
  }, []);

  const validationSchema = CreateGroupSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const canAddGroup = useMemo(() => {
    return roles?.includes(ADMIN) || roles?.includes(BOD);
  }, [roles]);
  const isDisabled = useMemo(() => !isValid || isSubmitting || isLoading, [isValid, isSubmitting, isLoading]);

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };
  const validFile = (fileName: string) => {
    const allowedExtensions = ['.jpeg', '.png'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setLogo('');
      setError('groupLogo', { message: 'not_supported' });
      return false;
    }
    return true;
  };
  const chooseFile = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if (file) {
      const dimensions = await getImageDimensions(file);
      if (file.size > MAX_FILE_SIZE) {
        setLogo('');
        setError('groupLogo', { message: 'file_size' });
        return;
      }
      if (dimensions.width !== WIDTH_AVATAR || dimensions.height !== HEIGHT_AVATAR) {
        setLogo('');
        setError('groupLogo', { message: `${t(`width_height`, { width: WIDTH_AVATAR, height: HEIGHT_AVATAR })}` });
        return;
      }
      if (!validFile(file.name)) {
        return;
      }
      file.preview = URL.createObjectURL(file);
      setLogo(file.preview);
      setError('groupLogo', { message: '' });
      setValue('groupLogo', file.preview);
      formData.append('file', file);
      dispatch(getGroupLogo({ params: formData }));
    }
  };

  const onSubmit = (data: any) => {
    const convertData = { ...data, groupLogo: storedKey };
    dispatch(createGroup({ params: convertData, callback: () => Router.push(RouterPath.Home) }));
  };
  useEffect(() => {
    if (!canAddGroup) {
      router.push(RouterPath.PageNotFound);
    }
  }, []);
  return (
    <MainLayout title="create_group">
      <div className="content mt-3">
        <div className="container-fluid">
          <Row>
            <div className="left-width" />
            <div className="body-width">
              <div className="frame mt-2">
                <h1 className="text-center size-text-2">{t('create_new_group')}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={3} lg={2}>
                      <label className="size-text required">{t('group_name')}</label>
                    </Col>
                    <Col md={9} lg={10}>
                      <input className="form-control" placeholder={t('group_name')} {...register('name')} />
                      <div className="content-message">
                        {errors.name && <span className="color-message">{t(errors.name.message)}</span>}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3} lg={2}>
                      <label className="size-text required" title={t('obligatory')}>
                        {t('group_description')}
                      </label>
                    </Col>
                    <Col md={9} lg={10}>
                      <textarea className="form-control" placeholder={t('group_description')} {...register('description')} />
                      <div className="content-message description-message">
                        {errors.description && <span className="color-message">{t(errors.description.message)}</span>}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3} lg={2}>
                      <label className="size-text required">{t('group_type')}</label>
                    </Col>
                    <Col md={9} lg={10}>
                      <Input type="select" className="form-control" id="exampleSelect" {...register('groupType')}>
                        <option value="">{t('group_type')}</option>
                        {groupType.map((type, index) => (
                          <option key={type.id} value={type.id}>
                            {t(type.name)}
                          </option>
                        ))}
                      </Input>
                      <div className="content-message">
                        {errors.groupType && <span className="color-message">{t(errors.groupType.message)}</span>}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3} lg={2}>
                      <label id="laber" className="size-text">
                        {t('group_logo')}:
                      </label>
                    </Col>
                    <Col md={9} lg={10}>
                      <label htmlFor="myFileInput" className="hoverable center-avatar">
                        {groupLogo && <img src={groupLogo} alt="" id="image" className="hoverable" />}
                        <div className="hover-text">{t('choose_logo')}</div>
                      </label>
                      <input
                        type="file"
                        className="display-choose-file"
                        id="myFileInput"
                        onChange={chooseFile}
                        accept="image/png , image/jpeg"
                      />
                      <div className="content-message">
                        {errors.groupLogo && <p className="color-message message-avatar">{t(errors.groupLogo.message)}</p>}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center margin-btn">
                    <Link href={RouterPath.Home}>
                      <Button type="button" className="btn cancel-btn distance-btn">
                        {t('cancel')}
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className={isDisabled ? 'btn disable-btn distance-btn' : 'btn btn-danger submit-btn distance-btn'}
                      disabled={isDisabled}
                    >
                      <div> {t('submit')}</div>
                      {isLoading && <div className="spinner-border text-light" role="status" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div className="right-width" />
          </Row>
          <CustomToastContainer />
        </div>
      </div>
    </MainLayout>
  );
};
export default withAuth(Group);
