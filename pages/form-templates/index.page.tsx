import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledButtonDropdown } from 'reactstrap';
import { useTranslation } from 'i18next-config';
import Link from 'next/link';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { FormTemplate } from 'types/formTemplate';
import { useRouter } from 'next/router';
import { ChevronDown } from 'react-feather';
import CartFormTemplate from '@/pages/modules/card-form-template/cardFormTemplate';
import CardFormTemplateMobile from '@/pages/modules/card-form-template/cardFormTemplateMobile';
import { setPage } from '@/redux/actions/pagesAction';
import { RouterPath, PageTitle } from '@/shared/constant/common';
import MainLayout from '@/components/layout/mainLayout';
import { DATE_TIME, DEFAULT_PER_PAGE, defaultParamsFormTemplates, NAME, NEW_PER_PAGE, PAGE } from '@/shared/constant/param';
import { getFormTemplate } from '@/redux/actions/formActions';
import { ADMIN, BOD } from '@/redux/constants';
import withAuth from '@/pages/modules/shared/hoc/withAuth';
import PreLoaderWidget from '@/components/loader';
import { RootState } from '@/redux/rootReducer';

const FormTemplates = () => {
  const [t] = useTranslation('home');
  const dispatch = useDispatch();
  const [params, setParams] = useState(defaultParamsFormTemplates);
  const [name, setName] = useState('');
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const { roles } = useSelector((state: RootState) => state.authReducer);
  const { isLoading, next } = useSelector((state: RootState) => state.formReducer);
  const router = useRouter();
  const sortData = [
    { id: 1, sort_column: 'name', sort_type: 'asc' },
    { id: 2, sort_column: 'name', sort_type: 'desc' },
    { id: 3, sort_column: 'createdDate', sort_type: 'desc' },
    { id: 4, sort_column: 'createdDate', sort_type: 'asc' },
  ];

  const sortTitle = useMemo(() => t(`${params.sort_column}_${params.sort_type}`), [params]);

  useEffect(() => {
    dispatch(getFormTemplate({ params, callback: (list: any) => setFormTemplates(list) }));
    dispatch(setPage({ params: [PageTitle.FormTemplateList] }));
  }, []);

  const handleClickSortItem = (column: string, sortType: string) => {
    const newParams = { ...params, page: 1, per_page: formTemplates.length, sort_column: column, sort_type: sortType };
    setParams(newParams);
    dispatch(getFormTemplate({ params: newParams, callback: (list: any) => setFormTemplates(list) }));
  };
  const canAddFormTemplate = useMemo(() => {
    return roles?.includes(ADMIN) || roles?.includes(BOD);
  }, [roles]);

  const searchByName = async (event: any) => {
    if (event.charCode === 13) {
      event.preventDefault();
      const newParams = { ...params, keyword: name, page: PAGE, per_page: DEFAULT_PER_PAGE };
      setParams(newParams);
      dispatch(getFormTemplate({ params: newParams, callback: (list: any) => setFormTemplates(list) }));
    }
  };
  const getShowMore = () => {
    const newParams = { ...params, page: params.page + 1 };
    setParams(newParams);
    dispatch(getFormTemplate({ params: newParams, callback: (list: any) => setFormTemplates([...formTemplates, ...list]) }));
  };
  const getGroupByName = (paramSearch: any) => {
    dispatch(getFormTemplate({ params: paramSearch, callback: (list: any) => setFormTemplates(list) }));
    setParams(paramSearch);
  };
  const debouncedCallback = useCallback(
    debounce((paramSearch: any) => getGroupByName(paramSearch), 800),
    []
  );
  const handleChange = (event: any) => {
    setName(event.target.value);
    const newParams = { ...params, keyword: event.target.value, page: PAGE, per_page: DEFAULT_PER_PAGE };
    debouncedCallback(newParams);
  };
  useEffect(() => {
    router.push({ pathname: RouterPath.FormTemplates, query: params }, undefined, { shallow: true });
  }, [params]);

  const getForms = () => {
    const newParams = { ...params, page: 1 };
    setParams(newParams);
    dispatch(getFormTemplate({ params: newParams, callback: (list: any) => setFormTemplates(list) }));
  };
  return (
    <MainLayout title={'form'}>
      <div className="content mt-3">
        <div className="container-fluid">
          <Row className="height-card-form">
            <Col lg={6} md={6} sm={6}>
              <p className="title-form-list" title={t('title_and_total_form', { quantity: formTemplates.length })}>
                {t('form_templates')}
                <span className="total-form">{t('forms_total', { quantity: formTemplates.length })}</span>
              </p>
            </Col>
            <Col lg={6} md={6} sm={6}>
              {canAddFormTemplate && (
                <Link href={RouterPath.FormCreate}>
                  <button className="btn btn-danger btn-add-form">
                    <span className="btn-text-form">{t('add_form_template')}</span>
                    <span className="icon-add" />
                  </button>
                </Link>
              )}
            </Col>
          </Row>
          <Row className="adjust-input-search height-card-form">
            <Col lg={6} md={6} sm={6}>
              <span className="icon-GroupSearch" />
              <input
                onChange={handleChange}
                value={name}
                onKeyPress={searchByName}
                placeholder={t('search_form')}
                className="search-input-form"
              />
            </Col>
            <Col lg={6} md={6} sm={6}>
              <div className="box-sort-by">
                <UncontrolledButtonDropdown>
                  <DropdownToggle tag="span">
                    <span className="display-title">{t('sort_by')} </span>
                    <span className="text-danger">
                      <span className="sort-by">{sortTitle}</span>
                    </span>
                    <ChevronDown />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {sortData.map(sortItem => (
                      <DropdownItem key={sortItem.id} onClick={() => handleClickSortItem(sortItem.sort_column, sortItem.sort_type)}>
                        <span>
                          <span className="d-block pl-2 mt-3p line-height-1 ">{t(`${sortItem.sort_column}_${sortItem.sort_type}`)}</span>
                        </span>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </Col>
          </Row>
          {formTemplates.length ? (
            <div>
              <div className="row-spacing display-title">
                <Row className="width-row">
                  <Col className="size-text-form" lg={6} md={4} sm={3}>
                    {t('name_form')}
                  </Col>
                  <Col className="text-center size-text-form" lg={3} md={4} sm={4}>
                    {t('form_creator')}
                  </Col>
                  <Col className="text-center size-text-form center-title-icon" lg={2} md={3} sm={4}>
                    {t('create_date')}
                  </Col>
                  {canAddFormTemplate && (
                    <Col className="text-center size-text-form center-title-icon" lg={1} md={1} sm={1}>
                      {t('action')}
                    </Col>
                  )}
                </Row>
              </div>
              <div className="display-card-pc">
                <div className="content-form position-relative">
                  {isLoading && <PreLoaderWidget />}
                  {formTemplates.map((item: FormTemplate) => (
                    <CartFormTemplate getForms={getForms} key={item.id} form={item} canDeleteFormTemplate={canAddFormTemplate} />
                  ))}
                </div>
              </div>
              <div className="display-card-mobile">
                <div className="content-form position-relative">
                  {isLoading && <PreLoaderWidget />}
                  {formTemplates.map((item: FormTemplate) => (
                    <CardFormTemplateMobile getForms={getForms} key={item.id} form={item} canDeleteFormTemplate={canAddFormTemplate} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-center mt-5 pt-3">{t('no_forms_available')}</h1>
          )}
          <div className="p-3">
            {next != null && (
              <p onClick={getShowMore} className="show-more">
                {t('show_more')}
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default withAuth(FormTemplates);
