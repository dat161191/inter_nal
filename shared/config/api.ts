import axios, { AxiosResponse } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import i18next from 'i18next';
import { get, isNil, mergeWith } from 'lodash';
import Router from 'next/router';

import { stringifyParams } from 'shared/utils';
import { CookieKey, ERROR_CODE_IGNORE_REFRESH, ROUTER } from 'shared/constant/common';
import { URL_REFRESH_TOKEN } from 'shared/constant/endpoints';
import { CookiesStorage } from './cookie';
import { API_URL } from './setting';

i18next.loadNamespaces('error_message');

const customizer = (objValue: any, srcValue: any, key: string) => {
  if (key === 'Accept-Language') {
    return objValue;
  }
  return null;
};

export const generateToken = () => ({
  'ITS-Authorization': `Bearer ${CookiesStorage.getAccessToken()}`,
  // todo
});

const defaultOptions = {};

function getApi(path: string, options: any = {}, apiURL?: string) {
  return axios.get(`${apiURL || API_URL}/${path.replace(/^\//, '')}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...options.headers,
      ...generateToken(),
    },
  });
}

function postApi(path: string, data: any, options: any = {}) {
  const headerParams = mergeWith(options.headers, generateToken(), customizer);

  return axios.post(`${API_URL}/${path.replace(/^\//, '')}`, data, {
    ...defaultOptions,
    ...options,
    headers: { ...headerParams, ...generateToken() },
  });
}

function putApi(path: string, data: any, options: any = {}) {
  return axios.put(`${API_URL}/${path.replace(/^\//, '')}`, data, {
    ...defaultOptions,
    ...options,
    headers: {
      ...options.headers,
      ...generateToken(),
    },
  });
}

function patchApi(path: string, data: any, options: any = {}) {
  return axios.patch(`${API_URL}/${path.replace(/^\//, '')}`, data, {
    ...defaultOptions,
    ...options,
    headers: {
      ...options.headers,
      ...generateToken(),
    },
  });
}

function deleteApi(path: string, options: any = {}) {
  return axios.delete(`${API_URL}/${path.replace(/^\//, '')}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...options.headers,
      ...generateToken(),
    },
  });
}

let refreshTokenRequest: null | Promise<AxiosResponse<any>> = null;

async function handleErrorStatus(error: any) {
  const status = error?.status || error?.response?.status || null;
  const errorCode = error?.response?.data?.error_id;
  switch (status) {
    case 401:
      if (error.config.isRetryRequest) {
        CookiesStorage.clearAccessToken();
        CookiesStorage.clearRefreshToken();
        Router.push(ROUTER.Login);
        refreshTokenRequest = null;
        return Promise.reject(error);
      }
      if (!ERROR_CODE_IGNORE_REFRESH.includes(errorCode)) {
        try {
          refreshTokenRequest = refreshTokenRequest || getApi(URL_REFRESH_TOKEN);
          const newToken = await refreshTokenRequest;
          const { accessToken } = newToken.data.data;
          // eslint-disable-next-line no-param-reassign
          error.config.isRetryRequest = true;
          refreshTokenRequest = null;
          CookiesStorage.setAccessToken(accessToken);
          return axios({
            ...error.config,
            headers: { ...error.config?.headers, 'ITS-Authorization': `Bearer ${accessToken}` },
          });
        } catch (_err) {
          CookiesStorage.clearAccessToken();
          Router.push(ROUTER.Login);
          // eslint-disable-next-line no-param-reassign
          refreshTokenRequest = null;
          return Promise.reject(error);
        } finally {
          // eslint-disable-next-line no-param-reassign
          error.config.isRetryRequest = true;
          refreshTokenRequest = null;
        }
      }
      CookiesStorage.clearAccessToken();
      CookiesStorage.clearRefreshToken();
      if (get(Router, 'router.route') !== ROUTER.Login) {
        Router.push(ROUTER.Login);
      }
      return Promise.reject(error);

    case 404:
      Router.replace(ROUTER.PageNotFound);
      return Promise.reject(error);
    case 200:
    case 201:
    case 204:
    case 400:
      return Promise.reject(error);
    case 422:
      return Promise.reject(error);
    default:
      CookiesStorage.setCookieData(CookieKey.networkError, status ? `ERR-0${status}` : 'ERR-ANOTHER');
      return Promise.reject(error);
  }
}

axios.interceptors.response.use(
  response => {
    if (response && response.data) {
      return { ...response, data: camelizeKeys(response.data) };
    }
    return response;
  },
  error => {
    const errorResponse = error;
    const errorData = errorResponse?.response?.data || {};
    const errorMessageCode = errorData?.error?.message;
    const errorMessage = errorMessageCode ? i18next.t(`error_message:${errorMessageCode}`) : errorData.message;

    errorResponse.response = {
      ...errorResponse.response,
      data: {
        ...errorData.error,
        message: errorMessage,
        errors: errorData?.error?.errors || [],
      },
    };

    return handleErrorStatus(errorResponse);
  }
);

axios.interceptors.request.use(config => {
  const newConfig = { ...config };
  if (newConfig.headers['Content-Type'] === 'multipart/form-data') return newConfig;
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }
  return newConfig;
});

axios.defaults.paramsSerializer = params =>
  stringifyParams({
    params: decamelizeKeys({ ...params }),
    option: {
      encode: !isNil(params?.tags) || false,
    },
  });

const Api = {
  get: getApi,
  post: postApi,
  put: putApi,
  delete: deleteApi,
  patch: patchApi,
};

export default Api;
