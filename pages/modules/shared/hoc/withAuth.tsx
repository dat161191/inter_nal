import React, { useState, useEffect } from 'react';
import Login from 'pages/login/index.page';
import { CookiesStorage } from '@/shared/config/cookie';

const withAuth = (WrappedComponent: any) => {
  const AuthWrapper = (props: any) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
      const checkLoginStatus = () => {
        setIsLoggedIn(CookiesStorage.authenticated());
      };
      checkLoginStatus();
    }, []);
    if (isLoggedIn) {
      return <WrappedComponent {...props} />;
    }
    return <Login />;
  };

  return AuthWrapper;
};

export default withAuth;
