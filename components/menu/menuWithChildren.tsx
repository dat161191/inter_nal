import React, { Fragment } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { isEqual } from 'lodash';
import { MenuChildProps } from 'types/menu';
import MenuNoChild from './menuNoChild';

const MenuWithChildren = ({ route, title, icon, childItems, customIconClass, user, isActive }: MenuChildProps) => {
  const Icon = icon;
  return (
    <Fragment>
      <li
        className={classNames({
          'side-nav-item': true,
          'mm-active': isActive || false,
        })}
      >
        <Link href="#">
          <a className="side-nav-link-ref side-sub-nav-link side-nav-link has-arrow">
            <div className="menu-item">
              <div className="d-flex height-by-px-24">
                {icon && (
                  <span className="left-icon">
                    <Icon className={`icon-xs ${customIconClass}`} />
                  </span>
                )}{' '}
                <span className="font-weight-bold side-nav-text mt-2p">{title}</span>
              </div>
            </div>
            <span className="menu-arrow" />
          </a>
        </Link>
        <ul
          className={classNames({
            'nav-second-level mm-collapse': true,
            'mm-show': isActive || false,
          })}
        >
          {childItems &&
            childItems.map((child, index) => (
              <MenuNoChild
                labelClass="font-weight-normal"
                key={index + child.link}
                title={child.title}
                link={child.link}
                activePath={child.activePath}
                icon={child.icon}
                route={route}
                activeRegex={child.activeRegex}
                roles={child.roles}
                user={user}
                query={child.query}
                as={child.as}
              />
            ))}
        </ul>
      </li>
    </Fragment>
  );
};

MenuWithChildren.defaultProps = {
  childItems: [],
};
const MenuWithChildrenMemo = React.memo(MenuWithChildren, isEqual);
export default MenuWithChildrenMemo;
