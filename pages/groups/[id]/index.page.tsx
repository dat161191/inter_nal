import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Input, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Spinner } from 'reactstrap';
import { useTranslation } from 'i18next-config';
import { ChevronDown, Plus, Search } from 'react-feather';
import { toast } from 'react-toastify';
import { CustomToastContainer } from 'pages/modules/custom-toast/cutomToastify';
import { useDispatch, useSelector } from 'react-redux';
import { MembersType, Position } from 'types/group';
import { debounce } from 'lodash';
import Pagination from 'types/pagination';
import { useRouter } from 'next/router';
import CardMembers from '@/shared/utils/cardMembers';
import { GroupTypes, TabMenu } from '@/shared/constant/groupDetail';
import Description from '@/components/group-detail/description';
import { MenuNavigation } from '@/components/group-detail/menu-navigation';
import MainLayout from '@/components/layout/mainLayout';
import { addMember, getGroupDetail, getMembers, getMembersForm, getPositions } from '@/redux/actions/groupDetailAction';
import { RootState } from '@/redux/rootReducer';
import { PAGE, PageTitle, SORT_TYPE } from '@/shared/constant/common';
import { POSITION, defaultParamsMembers } from '@/shared/constant/paramMembers';
import withAuth from '../../modules/shared/hoc/withAuth';
import { setPage } from '@/redux/actions/pagesAction';
import { ADMIN, BOD } from '@/redux/constants';
import ModalAddMember from '@/components/group-detail/modalAddMember';

const defaultPagination = {
  next: 1,
  page: 1,
  perPage: 8,
  prev: null,
  total: 0,
};
interface SelectField {
  positionsForm: { value?: string; label?: string };
  membersForm: { value: string; label: string }[];
}
interface Group {
  id?: string;
  name?: string;
  groupLogo?: string;
  type?: string;
}
const GroupDetail = () => {
  const [t] = useTranslation('home');
  const dispatch = useDispatch();
  const router = useRouter();
  const idGroup = router.query;
  const [groupInfo, setGroupInfo] = useState<Group>();
  const [showDescription, setShowDescription] = useState(true);
  const [tab, setTab] = useState(TabMenu.MEMBERS);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [members, setMembers] = useState<MembersType[]>([]);
  const [paramsMembers, setParamsMembers] = useState(defaultParamsMembers);
  const { isLoading, isAddMember } = useSelector((state: RootState) => state.groupDetailReducer);
  const [valueSort, setValueSort] = useState(SORT_TYPE.DESC);
  const [groupId, setGroupId] = useState(idGroup.id);
  const roles = useSelector((state: RootState) => state.authReducer.roles);
  const canAddMember = useMemo(() => roles?.includes(ADMIN) || roles?.includes(BOD), [roles]);
  const [showModal, setShowModal] = useState(false);
  const [membersForm, setMembersForm] = useState<MembersType[]>([]);
  const [positionsForm, setPositionForm] = useState<Position[]>([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isSort, setIsSort] = useState(false);

  const showInforInUrl = (pathname: string, query: string) => {
    return router.push(
      {
        pathname,
        query,
      },
      undefined,
      { scroll: false }
    );
  };

  useEffect(() => {
    dispatch(
      getGroupDetail({
        params: idGroup,
        callback: data => {
          setGroupInfo(data.data);
          dispatch(setPage({ params: [PageTitle.Grouplist, data.data.name] }));
        },
      })
    );
    const params = { ...paramsMembers };
    dispatch(
      getMembers({
        params: { groupId, params },
        callback: data => {
          setMembers(data.data.items);
          setPagination(data.data.pagination);
          showInforInUrl(data.pathname, data.query);
        },
      })
    );
  }, []);

  const handleAuthorization = () => {
    const keyword = '';
    setShowModal(!showModal);
    dispatch(
      getMembersForm({
        params: { keyword, groupId },
        callback: data => {
          setMembersForm(data.data.items);
        },
      })
    );
    dispatch(
      getPositions({
        callback: data => {
          setPositionForm(data.data.items);
        },
      })
    );
  };

  const handleSort = async (value: string) => {
    setValueSort(value);
    const params = { ...paramsMembers, sort_column: POSITION, sort_type: value, page: PAGE };
    setIsSort(true);

    dispatch(
      getMembers({
        params: { groupId, params },
        callback: data => {
          setMembers(data.data.items);
          setPagination(data.data.pagination);
          setParamsMembers({ ...paramsMembers, sort_column: POSITION, sort_type: value, page: data.data.pagination.page });
          showInforInUrl(data.pathname, data.query);
          setIsSort(false);
        },
        errorCallback: () => {
          setIsSort(false);
        },
      })
    );
  };

  const debouncedCallback = useCallback(
    debounce(
      (paramDebounce: any) =>
        dispatch(
          getMembers({
            params: paramDebounce,
            callback: data => {
              setMembers(data.data.items);
              setPagination(data.data.pagination);
              setIsSearch(false);
              router.push({
                pathname: data.pathname,
                query: data.query,
              });
            },
            errorCallback: () => {
              setIsSearch(false);
            },
          })
        ),
      500
    ),
    []
  );

  const handleOnChangeSearch = async (event: any) => {
    event.preventDefault();
    const params = { ...paramsMembers, keyword: event.target.value, page: PAGE };
    setParamsMembers(params);
    setIsSearch(true);
    const paramDebounce = { groupId, params };
    debouncedCallback(paramDebounce);
  };

  const memberOptions = membersForm.map(member => ({
    value: member.id.toString(),
    label: member.fullName,
  }));
  const positionOptions = positionsForm.map(position => ({
    value: position.id,
    label: position.type,
  }));

  const addNewMember = async (values: SelectField) => {
    const positionId = values.positionsForm.value;
    const usersId = values.membersForm.map(ele => ele.value);
    dispatch(
      addMember({
        params: { groupId, positionId, usersId },
      })
    );
    toast.success(t('add_member_success'));
    setShowModal(!showModal);
  };

  useEffect(() => {
    const params = { ...defaultParamsMembers };
    dispatch(
      getMembers({
        params: { groupId, params },
        callback: result => {
          setMembers(result.data.items);
          setPagination(result.data.pagination);
          setParamsMembers(defaultParamsMembers);
          showInforInUrl(result.pathname, result.query);
        },
      })
    );
  }, [isAddMember]);

  const showNextMembers = async () => {
    const params = { ...paramsMembers, page: paramsMembers.page + 1 };
    setParamsMembers(params);
    setIsShowMore(true);
    dispatch(
      getMembers({
        params: { groupId, params },
        callback: data => {
          setMembers([...members, ...data.data.items]);
          setPagination(data.data.pagination);
          setParamsMembers({ ...paramsMembers, page: data.data.pagination.page });
          showInforInUrl(data.pathname, data.query);
          setIsShowMore(false);
        },
        errorCallback: () => {
          setIsShowMore(false);
        },
      })
    );
  };

  return (
    <>
      <MainLayout title="GroupDetail">
        {isLoading ? (
          <div className="w-100 vh-100 text-primary d-flex justify-content-center align-items-center">
            <Spinner size="xs" className="mx-2" />
            <h4 className="text-primary"> {t('loading')}</h4>
          </div>
        ) : (
          <div className="group-detail-page">
            <Row className="m-0">
              <Col md="10" className="m-0">
                <div className="member-list">
                  <div className="group-name-container d-flex justify-content-start align-items-center">
                    <div className="group-img-container d-flex justify-content-start align-items-center ">
                      <div className="group-img-content">
                        <img src={groupInfo?.groupLogo} alt="Avatar Group" className="avatar-group-detail" />
                      </div>
                    </div>

                    <div className="group-name-content">
                      <p className="group-name-text m-0">{groupInfo?.name}</p>
                      {groupInfo?.type === GroupTypes.PROJECT && <div className="type-project">{t('project')}</div>}
                      {groupInfo?.type === GroupTypes.NON_TECH && <div className="type-non-tech">{t('non_tech')}</div>}
                      {groupInfo?.type === GroupTypes.TECH && <div className="type-tech ">{t('tech')}</div>}
                    </div>
                  </div>

                  <div className="menu-container">
                    <MenuNavigation tab={tab} setTab={setTab} />

                    {tab === TabMenu.MEMBERS && (
                      <div className="w-100">
                        <div className="action-container w-100">
                          <div className="action-add w-100">
                            <div className="total-member-content">
                              <span className="total-member-title">{t('member_list')} </span>
                              <span className="total-member">({`${pagination?.total} ${t('member_total')}`})</span>
                            </div>

                            {canAddMember && (
                              <div className="add-member">
                                <Button className="button-add-member" onClick={handleAuthorization}>
                                  {t('add_member')} <Plus className="plus-member" />
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="action-search-sort">
                            <div className="action-search-container">
                              <div className="form-inline form-search">
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text icon-search" id="basic-addon1">
                                      <Search />
                                    </span>
                                  </div>
                                  <Input
                                    type="text"
                                    placeholder={t('search_member')}
                                    value={paramsMembers.keyword}
                                    onChange={event => handleOnChangeSearch(event)}
                                    className="input-search cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="action-sort-container">
                              <UncontrolledButtonDropdown>
                                <DropdownToggle tag="span">
                                  <span>{t('sort_by')} </span>
                                  <span className="sort-type">
                                    {t('position')} {t(valueSort)}
                                  </span>
                                  <ChevronDown />
                                </DropdownToggle>
                                <DropdownMenu right>
                                  {Object.values(SORT_TYPE).map(type => {
                                    return (
                                      <DropdownItem onClick={() => handleSort(type)} key={type}>
                                        <span>
                                          {t('position')} {t(type)}
                                        </span>
                                      </DropdownItem>
                                    );
                                  })}
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </div>
                          </div>
                        </div>

                        {isAddMember || isSearch || isSort ? (
                          <div className="mt-3 w-100 text-primary d-flex justify-content-center ">
                            <Spinner size="xs" className="mx-2" />
                            <h4 className="text-primary"> {t('loading')}</h4>
                          </div>
                        ) : (
                          <>
                            {tab === TabMenu.MEMBERS && members.length ? (
                              <>
                                <Row className="mb-3 m-0 p-0">
                                  {members.map((member: MembersType) => (
                                    <Col md={4} lg={4} xl={3} key={member.id} className="mb-3">
                                      <CardMembers member={member} />
                                    </Col>
                                  ))}
                                </Row>
                                <div className="d-flex justify-content-center align-items-center pb-2 cursor-pointer font-weight-bold">
                                  {pagination.next &&
                                    (isShowMore ? (
                                      <>
                                        <span className="mr-2 show-members" onClick={showNextMembers}>
                                          {t('show_more')}
                                        </span>{' '}
                                        <Spinner size="sm" className="show-members" />
                                      </>
                                    ) : (
                                      <span className="mr-5 show-members" onClick={showNextMembers}>
                                        {t('show_more')}
                                      </span>
                                    ))}
                                </div>
                              </>
                            ) : (
                              <h3 className="text-center mt-2">{t('is_empty', { field: t('member_list') })}</h3>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {[TabMenu.FORM_LIST, TabMenu.GROUP_MANAGEMENT, TabMenu.SUB_GROUP].includes(tab) && (
                      <div className="w-100">
                        <h1 className="text-center">{t('comming_soon')}</h1>
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              <Col md="2" className="m-0 p-0">
                <Description showDescription={showDescription} setShowDescription={setShowDescription} />
              </Col>
            </Row>
          </div>
        )}
        <CustomToastContainer />

        <ModalAddMember
          showModal={showModal}
          setShowModal={setShowModal}
          addNewMember={addNewMember}
          positionOptions={positionOptions}
          memberOptions={memberOptions}
        />
      </MainLayout>
    </>
  );
};
export default withAuth(GroupDetail);
