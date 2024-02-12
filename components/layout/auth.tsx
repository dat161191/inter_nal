import React from 'react';
import { connect } from 'react-redux';

type AuthLayoutProps = {
  children: any;
};

const AuthLayout = (props: AuthLayoutProps) => {
  const children = props.children || null;
  return <React.Fragment>{children}</React.Fragment>;
};

export default connect()(AuthLayout);
