import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MetisMenu from '@metismenu/react';
import { useRouter } from 'next/router';
import { RouterPath, PageTitle, USER_TYPE } from 'shared/constant/common';
import { MenuChildProps } from 'types/menu';
import { useTranslation } from 'i18next-config';
import { Task, Calendar, File, Home, Chart, Form } from '@/shared/constant/icon';
import MenuWithChildren from './menuWithChildren';
import MenuNoChild from './menuNoChild';

type Props = {
  currentUser?: any;
};

const LeftSidebar = (props: Props) => {
  const { currentUser } = props;
  const [t] = useTranslation('home');
  const router = useRouter();
  const { route } = router;
  const mainMenu = [
    {
      title: PageTitle.Grouplist,
      link: RouterPath.Home,
      icon: Home,
      activePath: RouterPath.Home,
      roles: [USER_TYPE.ADMIN, USER_TYPE.EDITOR, USER_TYPE.VIEWER],
    },
    {
      title: PageTitle.FormTemplateList,
      link: RouterPath.FormTemplates,
      icon: Form,
      activePath: RouterPath.FormTemplates,
      roles: [USER_TYPE.ADMIN, USER_TYPE.EDITOR, USER_TYPE.VIEWER],
    },
    {
      title: PageTitle.Assessment,
      link: RouterPath.Assessments,
      icon: File,
      activePath: RouterPath.Assessments,
      roles: [USER_TYPE.ADMIN, USER_TYPE.EDITOR, USER_TYPE.VIEWER],
    },
    {
      title: PageTitle.TaskManagement,
      link: '',
      icon: Task,
      activePath: '/dashboard2',
      roles: [USER_TYPE.ADMIN, USER_TYPE.EDITOR, USER_TYPE.VIEWER],
    },
    {
      title: PageTitle.Charts,
      link: '',
      icon: Chart,
      activePath: '/dashboard3',
      roles: [USER_TYPE.ADMIN, USER_TYPE.EDITOR, USER_TYPE.VIEWER],
    },
    {
      title: PageTitle.CalendarHover,
      link: '',
      icon: Calendar,
      activePath: '/dashboard4',
      roles: [USER_TYPE.ADMIN, USER_TYPE.EDITOR, USER_TYPE.VIEWER],
    },
    // {
    //   title: 'User Management',
    //   link: '/users',
    //   activePath: '/users',
    //   icon: Users,
    //   customClass: 'side-nav-item user-management-item',
    //   customLinkClass: 'side-nav-link-ref side-sub-nav-link side-nav-link',
    //   roles: [USER_TYPE.ADMIN],
    //   query: {
    //     all: true,
    //   },
    //   as: '/users',
    // },
  ];

  const [menuList, setMenuList] = useState(mainMenu as [MenuChildProps]);

  return (
    <div className="sidebar-content">
      <div id="sidebar-menu">
        <div className="left-side-menu">
          <div className="sidebar-content">
            <div id="sidebar-menu" className="slimscroll-menu">
              <MetisMenu>
                {menuList &&
                  menuList.map((childMenu: MenuChildProps, index) =>
                    childMenu.childItems ? (
                      <MenuWithChildren
                        link={childMenu.link}
                        key={`${index}_${childMenu.activePath}`}
                        title={childMenu.title}
                        childItems={childMenu.childItems}
                        // parent={childMenu.activePath}
                        icon={childMenu.icon}
                        route={route}
                        activeRegex={childMenu.activeRegex}
                        customIconClass={childMenu.customIconClass}
                        roles={childMenu.roles}
                        user={currentUser}
                        // t={t}
                        isActive={childMenu.isActive}
                      />
                    ) : (
                      <MenuNoChild
                        key={`${index}_${childMenu.activePath}`}
                        title={t(childMenu.title)}
                        childItems={childMenu.childItems}
                        // parent={childMenu.activePath}
                        icon={childMenu.icon}
                        link={childMenu.link}
                        route={route}
                        activePath={childMenu.activePath}
                        customIconClass={childMenu.customIconClass}
                        customClass={childMenu.customClass}
                        customLinkClass={childMenu.customLinkClass}
                        roles={childMenu.roles}
                        user={currentUser}
                        query={childMenu.query}
                        as={childMenu.as}
                      />
                    )
                  )}
              </MetisMenu>
            </div>
            <div className="clearfix" />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.authReducer.user,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(LeftSidebar);
