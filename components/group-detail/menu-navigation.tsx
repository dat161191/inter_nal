import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'i18next-config';
import { TabMenu } from '@/shared/constant/groupDetail';

interface IMenuProps {
  tab?: string;
  setTab: Dispatch<SetStateAction<string>>;
}

export const MenuNavigation = ({ tab, setTab }: IMenuProps) => {
  const [t] = useTranslation('home');
  const menu = [
    { nameTab: TabMenu.MEMBERS, className: 'members-list', title: t('member_list') },
    { nameTab: TabMenu.FORM_LIST, className: 'form-list', title: t('form_list') },
    { nameTab: TabMenu.SUB_GROUP, className: 'sub-group', title: t('sub_group') },
    {
      nameTab: TabMenu.GROUP_MANAGEMENT,
      className: 'group-management',
      title: t('group_management'),
    },
  ];

  return (
    <div className="menu-navigation">
      {menu &&
        menu.map((ele, index) => {
          return (
            <div
              key={index}
              className={tab === ele.nameTab ? `${ele.className} menu-navigation-tab` : 'menu-navigation-tab'}
              onClick={() => {
                setTab(ele.nameTab);
              }}
            >
              <span>{ele.title}</span>
            </div>
          );
        })}
    </div>
  );
};
