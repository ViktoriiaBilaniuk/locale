import { Permissions } from '../../core/services/permissions/permissions.constant';

export const MENU_CONSTANTS = [
  {
    title: 'Menu.venueProfile',
    navigationUrl: './details',
    icon: 'icon-home',
    active: true,
    permission: true,
    permissionName: ''
  },
  {
    title: 'Menu.socialPerformance',
    navigationUrl: './performance',
    icon: 'icon-pie-chart',
    active: false,
    permission: true,
    permissionName: Permissions.STATS
  },
  {
    title: 'Menu.sceduledPosts',
    navigationUrl: './schedule',
    icon: 'icon-note',
    active: false,
    permission: false,
    permissionName: Permissions.INCOMING_POSTS
  },
  {
    title: 'Menu.events',
    navigationUrl: './events',
    icon: 'icon-calendar',
    active: false,
    permission: false,
    permissionName: Permissions.CALENDAR
  },
  {
    title: 'Menu.contentPool',
    navigationUrl: './files',
    icon: 'icon-folder-alt',
    active: false,
    permission: false,
    permissionName: ''
  },
/*  {
    title: 'Menu.reputation',
    navigationUrl: './reputation',
    icon: 'icon-badge',
    active: false,
    permission: false,
    permissionName: ''
  },*/
  {
    title: 'Menu.channels',
    navigationUrl: './channels',
    icon: 'icon-share',
    active: false,
    permission: false,
    permissionName: Permissions.CHANNELS
  },
  {
    title: 'Menu.ads',
    navigationUrl: './ads',
    icon: 'icon-briefcase',
    active: false,
    permission: false,
    permissionName: Permissions.ADVERTISEMENT
  }
];
