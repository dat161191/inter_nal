import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'i18next-config';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { List } from 'react-feather';
import { TabMenu } from '@/shared/constant/groupDetail';

interface IMenuProps {
  setTab: Dispatch<SetStateAction<string>>;
}

export const MenuGroupDropDown = ({ setTab }: IMenuProps) => {
  const [t] = useTranslation('home');
  const menuDropDown = [
    { nameTab: TabMenu.MEMBERS, title: t('member_list') },
    { nameTab: TabMenu.FORM_LIST, title: t('form_list') },
    { nameTab: TabMenu.SUB_GROUP, title: t('sub_group') },
    { nameTab: TabMenu.GROUP_MANAGEMENT, title: t('group_management') },
  ];

  return (
    <div className="list-menu">
      <UncontrolledButtonDropdown>
        <DropdownToggle caret color="primary">
          <List className="icon-list" />
        </DropdownToggle>
        <DropdownMenu right>
          {menuDropDown &&
            menuDropDown.map((ele, index) => {
              return (
                <DropdownItem key={index} onClick={() => setTab(ele.nameTab)}>
                  <span>{ele.title}</span>
                </DropdownItem>
              );
            })}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  );
};
