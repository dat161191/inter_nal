import { menuState } from '../constants/menuAction';

export function setMenuStateExpanded() {
  return {
    type: menuState.EXPANDED,
  };
}

export function setMenuStateCollapse() {
  return {
    type: menuState.COLLAPSE,
  };
}
