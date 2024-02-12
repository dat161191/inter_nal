import React, { Fragment } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { MenuChildProps } from 'types/menu';
import { useTranslation } from 'i18next-config';
import css from '../../assets/scss/custom/pages/_sidebar.module.scss';

const MenuNoChild = ({
  title,
  route,
  link,
  activePath,
  icon,
  customClass,
  customIconClass,
  customLinkClass,
  labelClass,
  activeRegex,
  query,
  as,
}: MenuChildProps) => {
  const isActivedItem = link === route;
  const renderLinkItem = () => (
    <a
      className={classNames(customLinkClass || '', {
        active: activeRegex ? activeRegex.test(route) : isActivedItem,
      })}
    >
      <div className="menu-item">
        <div className="d-flex align-items-center height-by-px-24">
          <span className={`${icon} icon `}></span>
          <span className={`${labelClass || ''} side-nav-text`}>{title}</span>
        </div>
      </div>
    </a>
  );

  return (
    <Fragment>
      <li
        className={classNames(customClass, {
          'mm-active': isActivedItem,
        })}
      >
        {link ? (
          <Link
            href={{
              pathname: link,
              query,
            }}
            as={as}
          >
            {renderLinkItem()}
          </Link>
        ) : (
          renderLinkItem()
        )}
      </li>
    </Fragment>
  );
};

export default MenuNoChild;
