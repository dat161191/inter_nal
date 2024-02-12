import React, { useState, useEffect, Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Container, Dropdown, DropdownMenu, DropdownToggle, Button, DropdownItem, UncontrolledButtonDropdown } from 'reactstrap';
import { User, LogOut } from 'react-feather';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { CookiesStorage } from 'shared/config/cookie';
import { RouterPath } from 'shared/constant/common';
import { setMenuStateCollapse, setMenuStateExpanded } from 'redux/actions/menuActions';
import { logout, getMe } from 'redux/actions/authActions';
import { Action, Payload } from 'types/action';
import { useTranslation } from 'i18next-config';
import DropDownIcon from '@/assets/images/icons/Dropdown.svg';
import Oval from '@/assets/images/avatar-user.png';
import TaskIcon from '@/assets/images/icons/Task.svg';
import MenuIcon from '@/assets/images/icons/menu.svg';
import NotificationIcon from '@/assets/images/icons/Notification.svg';
import translate from '@/assets/images/translate2.png';

interface ITopbarProps extends PropsFromRedux {
  logoutAction: (payload?: Payload | any) => Dispatch<Action>;
  pages: string[];
}

const Topbar = (props: ITopbarProps) => {
  const router = useRouter();
  const [t, i18next] = useTranslation('home');
  const changeLanguage = (lng: 'en' | 'ja') => {
    i18next.changeLanguage(lng);
  };
  const { currentUser, logoutAction, menuExpanded, setMenuExpanded, setMenuCollapse, getUserInfo, pages = [] } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleResize = () => {
    const width = window.innerWidth;
    if (width <= 767) {
      setMenuCollapse();
    }
  };

  useEffect(() => {
    getUserInfo({
      callback: () => router.push(RouterPath.Login),
    });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', () => {
      handleResize();
    });
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logoutAction({
      callback: () => {
        CookiesStorage.clearAccessToken();
        CookiesStorage.clearRefreshToken();
        Router.push(RouterPath.Login);
      },
    });
  };

  const setMenuState = (e: any) => {
    e.preventDefault();
    if (!menuExpanded) {
      setMenuExpanded();
      return;
    }
    setMenuCollapse();
  };

  return (
    <React.Fragment>
      <div className="navbar navbar-expand flex-column flex-md-row navbar-custom">
        <Container fluid>
          <Button onClick={setMenuState} color="info" className="button-menu-mobile bg-color-transparent mr-0 ml-0">
            <img src={MenuIcon} alt="menu" />
          </Button>
          <Link href={RouterPath.Home}>
            <a className="navbar-brand ml-0 mr-3 mr-md-2 ">
              <span className="logo-lg d-flex align-items-center">
                <span className="font-color h5 ml-3 text-logo">{t('name_project')}</span>
              </span>
            </a>
          </Link>
          <a className="navbar-brand mr-2 mr-md-2 page">
            <span className="logo-lg d-flex align-items-center">
              <div className="ml-4 pt-2">
                {pages.map((page, index) => (
                  <span key={`${index}_${page}`} className={`${index < pages.length - 1 && 'page-active'} ml-2 page-name`}>
                    {index !== 0 && RouterPath.Page} {t(page || '')}
                  </span>
                ))}
              </div>
            </span>
          </a>
          <ul className="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0">
            <div className="row flex-row float-right align-items-center mr-0 col-flex">
              <UncontrolledButtonDropdown>
                <DropdownToggle tag="a" className="icon-nav-bar">
                  <img src={translate} className="icon-nav-bar" alt="translate" />
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
              <img src={TaskIcon} className="icon-nav-bar" alt="task" />
              <div className="box-notification">
                <img src={NotificationIcon} className="icon-nav-bar" alt="Notification" />
                <span className="number-notification">5</span>
              </div>
            </div>
            <li className="notification-list">
              <Dropdown className="flex-row d-flex float-right" isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle
                  data-toggle="dropdown"
                  tag="a"
                  className="nav-link dropdown-toggle "
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                >
                  <div className="row align-items-center col-flex">
                    <img className="avatar" src={currentUser?.avatar ? currentUser.avatar : Oval}></img>
                    <div className="text-name">
                      <p className="hello">{t('welcome')}</p>
                      <p className="name">{currentUser?.fullName}</p>
                    </div>
                    <img src={DropDownIcon} className="dropdown-icon" alt="dropdown" />
                  </div>
                </DropdownToggle>
                <DropdownMenu right className="dropdown-md profile-dropdown">
                  <div role="button" onClick={toggleDropdown}>
                    <div className="dropdown-item border-bottom">{currentUser && currentUser?.fullName}</div>
                    <div style={{ cursor: 'pointer' }} className="d-flex align-items-center dropdown-item" role="button">
                      <span className="d-block pl-2 mt-3p line-height-1 ">
                        <User className="drop-item" /> {t('my_profile')}
                      </span>
                    </div>
                    <div className="dropdown-item" role="button" onClick={() => handleLogout()}>
                      <div style={{ cursor: 'pointer' }} className="d-flex align-items-center" role="button">
                        <span className="accounticon-logout" />
                        <span className="d-block pl-2 mt-3p line-height-1 ">
                          <LogOut className="drop-item" /> {t('logout')}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </li>
          </ul>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.authReducer.userInfo,
  menuExpanded: state.menuReducer.isExpanded,
  pages: state.pagesReducer.pages,
});

const mapDispatchToProps = (dispatch: any) => ({
  logoutAction: (payload: Payload) => dispatch(logout(payload)),
  getUserInfo: (payload: Payload) => dispatch(getMe(payload)),
  setMenuExpanded: () => dispatch(setMenuStateExpanded()),
  setMenuCollapse: () => dispatch(setMenuStateCollapse()),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof withConnect>;

export default withConnect(Topbar);
