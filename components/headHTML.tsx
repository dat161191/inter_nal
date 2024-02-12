import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import logo from 'assets/images/logo_title.png';

type HeadHTMLProps = {
  title: string;
  description: string;
  ogUrl: string;
  ogImage: string;
  ogKeywords: string;
  keywords: string;
};

const HeadHTML = (props: HeadHTMLProps) => {
  const { title, description, ogUrl, ogImage, ogKeywords, keywords } = props;

  return (
    <Head>
      <meta charSet="UTF-8" />
      <link rel="shortcut icon" type="image/x-icon" href={logo} />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:keywords" content={ogKeywords} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Head>
  );
};

HeadHTML.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  ogUrl: PropTypes.string,
  ogImage: PropTypes.string,
  ogKeywords: PropTypes.string,
  keywords: PropTypes.string,
};

HeadHTML.defaultProps = {
  title: 'Promoter Admin Console',
  description: null,
  ogUrl: null,
  ogImage: null,
  keywords: null,
  ogKeywords: null,
};

export default HeadHTML;
