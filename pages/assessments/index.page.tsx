import React, { useEffect, useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { useTranslation } from 'i18next-config';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import CartAssessments from '@/pages/modules/card-assessment/cardAssessments';
import CartAssessmentsMobile from '@/pages/modules/card-assessment/cardAssessmentMobile';
import { setPage } from '@/redux/actions/pagesAction';
import { RouterPath, PageTitle } from '@/shared/constant/common';
import MainLayout from '@/components/layout/mainLayout';

const Assessments = () => {
  const [t] = useTranslation('home');
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdownSortBy = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    dispatch(setPage({ params: [PageTitle.Assessment] }));
  }, []);

  const assessments = [
    {
      id: 0,
      img: 'https://toigingiuvedep.vn/wp-content/uploads/2021/05/hinh-anh-minh-hoa-nhom.jpg',
      groupName: 'GROUP NAME1',
      form: 3,
      createdDate: '2023-10-10T10:16:04Z',
      dueDate: '2023-10-10T10:16:04Z',
    },
    {
      id: 1,
      img: 'https://img6.thuthuatphanmem.vn/uploads/2022/10/27/anh-logo-nhom-lop-dep_092523708.jpg',
      groupName: 'GROUP NAME2',
      form: 3,
      createdDate: '2023-07-20T09:50:40Z',
      dueDate: '2023-07-20T09:50:40Z',
    },
    {
      id: 2,
      img: 'https://img6.thuthuatphanmem.vn/uploads/2022/10/27/anh-logo-nhom-lop-dep_092523708.jpg',
      groupName: 'GROUP NAME3',
      form: 3,
      createdDate: '2022-04-01T10:16:04Z',
      dueDate: '2021-07-25T10:16:04Z',
    },
    {
      id: 3,
      img: 'https://img6.thuthuatphanmem.vn/uploads/2022/10/27/anh-logo-nhom-lop-dep_092523708.jpg',
      groupName: 'GROUP NAME4',
      form: 3,
      createdDate: '2021-07-25T10:16:04Z',
      dueDate: '2021-07-25T10:16:04Z',
    },
    {
      id: 4,
      img: 'https://img6.thuthuatphanmem.vn/uploads/2022/10/27/anh-logo-nhom-lop-dep_092523708.jpg',
      groupName: 'GROUP NAME5',
      form: 3,
      createdDate: '2022-10-01T10:16:04Z',
      dueDate: '2021-07-25T10:16:04Z',
    },
  ];

  return (
    <MainLayout title={'assessment'}>
      <div className="content mt-3">
        <div className="container-fluid">
          <Row className="height-card-form">
            <Col sm={6}>
              <p className="title-form-list" title={t('title_and_total_assessment', { quantity: assessments.length })}>
                {t('assessment_list')}
                <span className="total-assessment">{t('assessment_total', { quantity: assessments.length })}</span>
              </p>
            </Col>
            <Col sm={6}>
              <Link href={RouterPath.FormCreate}>
                <button className="btn btn-danger btn-add-assessment">
                  <span className="btn-text-assessment">{t('add_assessment')}</span>
                  <span className="icon-add" />
                </button>
              </Link>
            </Col>
          </Row>
          <Row className="adjust-input-search height-card-form">
            <Col sm={6}>
              <span className="icon-GroupSearch" />
              <input placeholder={t('search_group')} className="search-input-form" />
            </Col>
            <Col sm={6}>
              <div className="box-sort-by">
                <span className="sort">{t('sort_by')}</span>
                <span className="sort-by">{t('created_date')}</span>
                <Dropdown className="flex-row d-flex float-right" isOpen={dropdownOpen} toggle={toggleDropdownSortBy}>
                  <DropdownToggle
                    data-toggle="dropdown"
                    tag="a"
                    className="dropdown-toggle "
                    onClick={toggleDropdownSortBy}
                    aria-expanded={dropdownOpen}
                  >
                    <span className="icon-chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu right className="dropdown-md profile-dropdown">
                    <div role="button">
                      <div className="d-flex align-items-center dropdown-item sort-value" role="button">
                        <span className="d-block pl-2 mt-3p line-height-1 ">{t('created_date')}</span>
                      </div>
                      <div className="dropdown-item" role="button">
                        <div className="d-flex align-items-center sort-value" role="button">
                          <span className="accounticon-logout" />
                          <span className="d-block pl-2 mt-3p line-height-1 ">{t('name')}</span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </Col>
          </Row>
          <div className="row-spacing display-attribute">
            <Row className="width-row">
              <Col className="size-text-form" lg={5} md={4}>
                {t('group')}
              </Col>
              <Col className="text-center size-text-form" md={2}>
                {t('form')}
              </Col>
              <Col className="text-center size-text-form center-title-icon" lg={2} md={3}>
                {t('create_date')}
              </Col>
              <Col className="text-center size-text-form center-title-icon" md={2}>
                {t('due_date')}
              </Col>
              <Col className="text-center size-text-form center-title-icon" md={1}>
                {t('action')}
              </Col>
            </Row>
          </div>
          <div className="display-assessment">
            <div className="content-form">
              {assessments.map(item => (
                <CartAssessments key={item.id} assessments={item} />
              ))}
            </div>
          </div>
          <div className="display-assessment-mobile">
            <div className="content-form">
              {assessments.map(item => (
                <CartAssessmentsMobile key={item.id} assessments={item} />
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="show-more">{t('show_more')}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Assessments;
