// Facebook constants

export const FACEBOOK_MAX_DESCRIPTION_COUNT = 63206; // 63206
export const FACEBOOK_ALBUM_NAME_LIMIT = 65;
export const FACEBOOK_DESKTOP_DESCRIPTION_LIMIT = 477;
export const FACEBOOK_DESKTOP_DESCRIPTION_LIMIT_ROWS = 5;
export const FACEBOOK_MOBILE_DESCRIPTION_LIMIT = 210;
export const FACEBOOK_POST_TYPES = [
  {title: 'status', selected: true},
  {title: 'album', selected: false},
  {title: 'linked', selected: false}
];
// {title: 'linked', selected: false},
export const FACEBOOK_DEFAULT_POST_TYPE = FACEBOOK_POST_TYPES[0];
export const FACEBOOK_MAX_VIDEO_SIZE = 30;
export const FACEBOOK_MAX_IMAGE_SIZE = 10;
export const FACEBOOK_DEFAULT_IMAGE_URL = '/assets/images/channels/facebook.svg';

// Instagram constants

export const INSTAGRAM_MAX_DESCRIPTION_COUNT = 2200; // 2200
export const INSTAGRAM_DESKTOP_DESCRIPTION_LIMIT = 113;
export const INSTAGRAM_MOBILE_DESCRIPTION_LIMIT = 70; // 70
export const INSTAGRAM_DESKTOP_DESCRIPTION_LIMIT_ROWS = 2;
export const INSTAGRAM_MAX_IMAGE_SIZE = 30; // 30 MB
export const INSTAGRAM_MAX_VIDEO_SIZE = 30; // 30 MB
export const INSTAGRAM_DEFAULT_IMAGE_URL = '/assets/images/channels/instagram.svg';

// Twitter constants

export const TWITTER_MAX_DESCRIPTION_COUNT = 280; // 280
export const TWITTER_MAX_VIDEO_SIZE = 15;
export const TWITTER_MAX_IMAGE_SIZE = 5;
export const TWITTER_MAX_VIDEO_DURATION = 30; // seconds
export const TWITTER_DEFAULT_IMAGE_URL = '/assets/images/channels/twitter.svg';

// general

export const DEFAULT_CHANNEL_NAME = 'No selected channel';

export const EDIT_POST_MENU_ITEM = {className: 'icon-pencil', title: 'edit'};
export const COPY_POST_MENU_ITEM = {className: 'icon-docs', title: 'copy'};
export const DELETE_POST_MENU_ITEM = {className: 'icon-trash', title: 'delete'};

export const MAX_IMAGE_SIZE = 10;
export const MAX_VIDEO_SIZE = 15;

export const FILE_TYPES = 'video/mp4,.png,.jpg,.jpeg,.gif';
export const IMAGE_TYPES = '.png,.jpg,.jpeg,.gif';

export const NETWORKS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram'
};

export const POST_TYPE = {
  STATUS: 'status',
  ALBUM: 'album',
  LINKED: 'linked'
};

export const SRC_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
  PICTURE: 'picture'
};

export const ACTION_TYPE = {
  COPY: 'copy',
  EDIT: 'edit',
  DELETE: 'delete'
};

export const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

export const DISCONNECTED_CHANNEL_ERROR_MESSAGE = 'This channel has been disconnected.' +
  'Please, reconnect the channel in order to edit the post';

export const SUBTYPE = {
  ALBUM: 'album',
};
