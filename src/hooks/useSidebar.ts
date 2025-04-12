import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setSidebar, toggleSidebar } from '../redux/sidebarSlice';

export const useSidebar = () => {
  const open = useSelector((state: RootState) => state.sidebar.open);
  const dispatch = useDispatch();
  const setOpen = (value: boolean) => dispatch(setSidebar(value));
  const toggle = () => dispatch(toggleSidebar());

  return { open, setOpen, toggle };
};