import React from 'react';
import '../assets/scss/theme.scss';
import { AppProps } from 'next/app';
import { connect } from 'react-redux';
import { wrapper } from 'redux/store';
import { appWithTranslation } from 'i18next-config';
import { CustomToastContainer } from 'pages/modules/custom-toast/cutomToastify';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <CustomToastContainer />
    <Component {...pageProps} />
  </>
);

const mapDispatchToProps = () => ({});

const withConnect = connect(null, mapDispatchToProps);

export default wrapper.withRedux(withConnect(appWithTranslation(MyApp)));
