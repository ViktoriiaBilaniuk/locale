export const POST_FILE_MOCK = {
  desc: 'desc',
  url: 'url'
};

export const POST_MOCK = {
  message: 'mess',
  channels: ['1'],
  pictures: ['image'],
  type: 'picture',
  date: '2019-01-03T09:48:20.938Z',
  _id: 1
};

export const POST_WITH_MESSAGE_MOSK = {
  message: 'mess',
  channels: ['1']
};

export const POST_WITH_IMAGE_MOSK = {
  message: 'mess',
  channels: ['1'],
  picture_url: 'url'
};

export const POST_WITH_VIDEO_MOSK = {
  message: 'mess',
  channels: ['1'],
  video_url: 'url'
};

export const ALBUM_POST_MOSK = {
  message: 'mess',
  channels: ['1'],
  album: {
    name: 'album name',
    files: [POST_FILE_MOCK]
  }
};

export const DESCRIPTION_MOCK = { value: 'mess', valid: true };

export const SCHEDULE_MOCK = {timezone: 'Europe/Kiev', utcTimestamp: 1, error: false, dateForEdit: false};

export const DESCRIPTION_TEXT_MOCK = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.' +
  'Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,' +
  'ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massage';
