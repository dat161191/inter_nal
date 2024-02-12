import React from 'react';
import { compose } from 'redux';
import { CookiesStorage } from 'shared/config/cookie';
import Login from './login/index.page';
import Home from './home/index.page';

const Index = () => (CookiesStorage.authenticated() ? <Home loading={false} error /> : <Login />);

export default compose(Index);
