import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import MainLayout from 'components/layout/mainLayout';
import { connect, ConnectedProps } from 'react-redux';
import { Group } from 'types/group';
import { getGroup } from 'redux/actions/groupActions';
import { PageTitle, RouterPath } from 'shared/constant/common';
import Link from 'next/dist/client/link';
import { NEW_PER_PAGE, defaultParams, DEFAULT_PER_PAGE, PAGE, NAME, DATE_TIME } from 'shared/constant/param';
import { useTranslation } from 'i18next-config';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { Plus } from 'react-feather';
import { debounce } from 'lodash';
import withAuth from 'pages/modules/shared/hoc/withAuth';
import IconSearch from '@/assets/images/icons/GroupSearch.svg';
import DropdownIcon from '@/assets/images/icons/chevron-down.svg';
import PreLoaderWidget from '@/components/loader';
import CardGroup from './cardGroup';
import { ADMIN, BOD } from '@/redux/constants/auth';
import { setPage } from '@/redux/actions/pagesAction';

interface IHomeProps extends PropsFromRedux {
  loading: boolean;
  currentUser: any;
  error: any;
  next: number | null;
  grouplist: Group[];
  roles: string[];
}

const Home = (props: IHomeProps) => {
  const [t] = useTranslation('home');
  const [params, setParams] = useState({ ...defaultParams });
  const { grouplist, getGroupList, loading, next, roles, setPages } = props;
  const [name, setName] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [sortColumn, setSortColumn] = useState(params.sort_column);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSort, setIsSort] = useState(true);
  const sortBy = (column: string) => {
    setIsSort(true);
    params.sort_column = column;
    setSortColumn(column);
    params.per_page = groups.length;
    params.page = 1;
    setParams({ ...params });
    getGroupList(params);
  };
  const canAddGroup = useMemo(() => {
    return roles?.includes(ADMIN) || roles?.includes(BOD);
  }, [roles]);
  const getShowMore = async () => {
    if (params.per_page === DEFAULT_PER_PAGE) {
      params.page = 3;
    } else if (params.per_page === NEW_PER_PAGE) {
      params.page += 1;
    } else {
      params.page = (params.per_page + 6) % 6;
    }
    params.per_page = NEW_PER_PAGE;
    setParams(params);
    await getGroupList(params);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const searchByName = async (event: any) => {
    if (event.charCode === 13) {
      event.preventDefault();
      params.page = PAGE;
      params.per_page = DEFAULT_PER_PAGE;
      params.keyword = name;
      setParams(params);
      await getGroupList(params);
    }
  };

  useEffect(() => {
    setPages([PageTitle.Grouplist]);
    getGroupList(params);
  }, []);

  const getGroupByName = (paramSearch: any) => {
    setParams(paramSearch);
    getGroupList(paramSearch);
  };

  const debouncedCallback = useCallback(
    debounce((paramSearch: any) => getGroupByName(paramSearch), 800),
    []
  );

  const handleChange = (event: any) => {
    const { value } = event.target;
    setName(value);
    params.page = PAGE;
    params.per_page = DEFAULT_PER_PAGE;
    params.keyword = value;
    debouncedCallback(params);
  };

  useEffect(() => {
    if (isSort) {
      setGroups([...grouplist]);
      setIsSort(false);
    } else {
      const newGroup = params.per_page === DEFAULT_PER_PAGE ? [...grouplist] : [...groups, ...grouplist];
      setGroups(newGroup);
    }
  }, [grouplist]);

  return (
    <MainLayout title="home">
      <div className="content mt-3">
        <div className="container-fluid">
          <Row className="col-flex-home">
            <Col>
              <p className="group-list">
                {t('group_list')}
                <span className="total">{t('groups_total', { quantity: groups.length })}</span>
              </p>
            </Col>
            <Col>
              {canAddGroup && (
                <Link href={RouterPath.CreateGroup}>
                  <button className="btn btn-danger btn-add">
                    <span className="btn-add-text">{t('add_new_group')}</span>
                    <Plus width={25} height={25} />
                  </button>
                </Link>
              )}
            </Col>
          </Row>
          <Row className="col-flex-home">
            <Col className="position-relative col-height">
              <input
                onChange={handleChange}
                value={name}
                onKeyPress={searchByName}
                placeholder={t('search_group')}
                className="search-input"
              />
              <img className="search-icon" alt="search" src={IconSearch} />
            </Col>
            <Col>
              <div className="box-sort">
                <span className="sort">{t('sort_by')}</span>
                <span className="sort-by">{t(sortColumn)}</span>
                <Dropdown className="flex-row d-flex float-right" isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle
                    data-toggle="dropdown"
                    tag="a"
                    className="dropdown-toggle "
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                  >
                    <img className="dropdown-icon" alt="sort" src={DropdownIcon} />
                  </DropdownToggle>
                  <DropdownMenu right className="dropdown-md profile-dropdown">
                    <div role="button" onClick={toggleDropdown}>
                      <div onClick={() => sortBy(DATE_TIME)} className="d-flex align-items-center dropdown-item sort-value" role="button">
                        <span className="d-block pl-2 mt-3p line-height-1 ">{t('createdDate')}</span>
                      </div>
                      <div className="dropdown-item" role="button">
                        <div onClick={() => sortBy(NAME)} className="d-flex align-items-center sort-value" role="button">
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
          {groups.length ? (
            <div className="pt-2 row group-pt position-relative">
              {loading && <PreLoaderWidget />}
              {groups.map((item: Group) => (
                <React.Fragment key={item.id}>
                  <CardGroup group={item} />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <h1 className="text-center mt-5 pt-3">{t('no_group_available')}</h1>
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

const mapStateToProps = (state: any) => ({
  currentUser: state.authReducer.userInfo,
  roles: state.authReducer.roles,
  grouplist: state.groupReducer.groups,
  next: state.groupReducer.next,
  loading: state.groupReducer.isLoading,
});
const mapDispatchToProps = (dispatch: any) => ({
  getGroupList: (params: any) => dispatch(getGroup({ params })),
  setPages: (params: any) => dispatch(setPage({ params })),
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof withConnect>;
export default withAuth(withConnect(Home));
