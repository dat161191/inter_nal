const USER_TYPE = {
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  VIEWER: 'VIEWER',
};

const CookieKey = {
  accessToken: 'AccessToken',
  refreshToken: 'RefreshToken',
  previousUrl: 'previousUrl',
  networkError: 'networkError',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const WIDTH_AVATAR = 640;
export const HEIGHT_AVATAR = 640;
export const FORMAT_STRING_DATE = 'dd/MMM/yyyy';
export const FORMAT_STRING_TIME = 'dd/MMM/yyyy HH:mm:ss';
const PageTitle = {
  CalendarHover: 'calendar_hover',
  Charts: 'charts',
  TaskManagement: 'task_management',
  Assessment: 'assessment',
  Grouplist: 'group_list',
  AddNewGroup: 'add_new_group',
  FormTemplateList: 'form_template_list',
  FormAdd: 'form_add',
  GroupDetail: 'Parent group name',
};

const ROUTER = {
  Home: '/',
  PageNotFound: '/404',
  Login: '/login',
  Dashboard: '/order',
};

const RouterPath = {
  IssueMeetingURL: '/meeting-url',
  UserManagement: '/users',
  Dashboard: '/dashboard',
  Page: '/',
  Home: '/home',
  PageNotFound: '/404',
  Login: '/login',
  GroupDetail: '/groups/[id]',
  CreateGroup: '/groups',
  ReissuePassword: '/reissue-password',
  BusinessManagement: '/companies',
  ContractManagement: '/contracts',
  ResetPassword: '/reset-password',
  FormTemplates: '/form-templates',
  FormCreate: '/form-templates/create',
  Assessments: '/assessments',
};
export const SORT_TYPE = {
  ASC: 'asc',
  DESC: 'desc',
};
export const PAGE = 1;

const ERROR_CODE_IGNORE_REFRESH = ['LOG-001', 'ERR-0999']; // error code login/refresh-token 401

export { ROUTER, USER_TYPE, CookieKey, PageTitle, RouterPath, ERROR_CODE_IGNORE_REFRESH };
