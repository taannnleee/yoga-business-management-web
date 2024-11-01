import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  BuildingStorefrontIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  GiftIcon,
  InboxStackIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import UserMenu from '../UserMenu';
import { Link, useRouteMatch } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { useDispatch } from 'react-redux';
import { setOpenSideBar } from '../../redux/slices/auth';

const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface ISideBarProps {
  content: any;
  title: string;
}

export default function MainLayout(props: ISideBarProps) {
  const theme = useTheme();
  const { path } = useRouteMatch();
  const { content, title } = props;
  const { openSideBar: open } = useAppSelector((state: IRootState) => state.auth);

  const dispatch = useDispatch();



  // Tạo state riêng biệt cho mỗi mục
  const [openOverview, setOpenOverview] = useState(false);
  const [openCourseManagement, setOpenCourseManagement] = useState(false);

  const handleOverviewClick = () => {
    setOpenOverview(!openOverview);
  };

  const handleCourseManagementClick = () => {
    setOpenCourseManagement(!openCourseManagement);
  };

  const icons = [
    <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />,
    <UserCircleIcon className="h-6 w-6 text-gray-500" />,
    <TagIcon className="h-6 w-6 text-gray-500" />,
    <InboxStackIcon className="h-6 w-6 text-gray-500" />,
    <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />,
  ];

  const activeIcons = [
    <ChartBarSquareIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <UserCircleIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <TagIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <InboxStackIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <BuildingStorefrontIcon className="h-6 w-6 font-semibold text-gray-500" />,
  ];

  const to = [
    '/home',
    '/user-management',
    '/category-management',
    '/products-management',
    '/store-management',
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={true} sx={{ backgroundColor: '#4b5563' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={true}>
        <DrawerHeader sx={{ pl: 4 }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="w-1/3 cursor-pointer text-center text-2xl font-bold text-gray-500 laptop:w-fit">
            Market Floor
          </p>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Mục Tổng quan */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleOverviewClick} sx={{ justifyContent: 'initial', px: 4 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                {openOverview ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary="Tổng quan" />
            </ListItemButton>
            <Collapse in={openOverview} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {['Báo cáo doanh thu', 'Phân tích khách hàng', 'Dự đoán xu hướng'].map((text) => (
                  <ListItemButton
                    key={text}
                    sx={{ pl: 8 }}
                    component={Link}
                    to={`${to[0]}/${text.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <ListItemText primary={text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* Mục Quản lý khóa học */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleCourseManagementClick} sx={{ justifyContent: 'initial', px: 4 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                {openCourseManagement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary="Quản lý khóa học" />
            </ListItemButton>
            <Collapse in={openCourseManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 8 }} component={Link} to={'/course-management'}>
                  <ListItemText primary="Khóa học" />
                </ListItemButton>

                <ListItemButton sx={{ pl: 8 }} component={Link} to={'/teacher-management'}>
                  <ListItemText primary="Giảng viên" />
                </ListItemButton>

                <ListItemButton sx={{ pl: 8 }} component={Link} to={'/topic-management'}>
                  <ListItemText primary="Chủ đề" />
                </ListItemButton>
              </List>
            </Collapse>
          </ListItem>

          {['Quản lý người dùng', 'Quản lý danh mục', 'Quản lý sản phẩm'].map((text, index) => (
            <Link to={to[index + 1]} key={text}>
              <ListItem disablePadding>
                <ListItemButton sx={{ justifyContent: 'initial', px: 4 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                    {path === to[index + 1] ? activeIcons[index + 1] : icons[index + 1]}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {content}
      </Box>
    </Box>
  );
}