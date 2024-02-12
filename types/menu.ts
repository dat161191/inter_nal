type MenuItem = {
  id: string;
  parentId: string;
  active?: boolean;
  children?: any;
};

type MenuChildProps = {
  title: string;
  route?: any;
  link: string;
  activePath?: string;
  icon?: any;
  customClass?: string;
  customIconClass?: string;
  customLinkClass?: string;
  labelClass?: string;
  activeRegex?: RegExp;
  roles?: any;
  user?: any;
  query?: any;
  as?: any;
  childItems?: [MenuChildProps];
  isActive?: boolean;
};

export type { MenuItem, MenuChildProps };
