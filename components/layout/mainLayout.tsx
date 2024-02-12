import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Head from 'next/head';
import TopBar from 'components/topBar';
import HeadHTML from 'components/headHTML';
import dynamic from 'next/dynamic';
import { useTranslation } from 'i18next-config';

type Props = {
  title: string;
  headData?: any;
  children: any;
  customClass?: string;
  menuExpanded?: boolean;
};

const DynamicLeftSideMenu = dynamic(() => import('components/menu/leftSideBar'), {
  ssr: false,
});

const MainLayout = (props: Props) => {
  const { headData, children, customClass, menuExpanded, title } = props;
  const [t] = useTranslation('home');
  return (
    <Fragment>
      <Head>{headData}</Head>
      <main id="mainLayout" className={`main-container ${customClass}`}>
        <div id="wrapper" className={`${menuExpanded ? '' : 'left-side-menu-condensed'}`}>
          <HeadHTML title={t(title)} />
          <TopBar />
          <DynamicLeftSideMenu />
          <div className="content-page">{children}</div>
        </div>
      </main>
    </Fragment>
  );
};

MainLayout.propTypes = {
  menuExpanded: PropTypes.bool,
};

MainLayout.defaultProps = {
  menuExpanded: true,
};

const mapStateToProps = (state: any) => ({
  menuExpanded: state.menuReducer.isExpanded,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(MainLayout);
