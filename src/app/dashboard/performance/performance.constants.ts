export const PERFORMACE_CONSTANTS = {
  PAID: 'post_impressions_paid_unique',
  ORGANIC: 'post_impressions_organic_unique',
  LIKES: 'post_likes',
  COMMENTS: 'post_comments',
  SHARES: 'post_shares'
};

export const PERFORMANCE_DROPDOWN_CONSTANTS = [
  { value: 'date', title: 'Performance.date' },
  { value: 'performance', title: 'Performance.bestPerforming'},
  { value: 'likes', title: 'Performance.mostLikes'},
  { value: 'reach', title: 'Performance.highestReach'},
];

export const FB_COLUMN_NAMES = [
  {title: 'Performance.facebookChannels', className: 'Facebook Channels'},
  {title: 'Performance.totalReach', className: 'Total reach'},
  {title: 'Performance.paidOrganic', className: 'Paid Organic'},
  {title: 'Performance.likes', className: 'Likes'},
  {title: 'Performance.comments', className: 'Comments'},
  {title: 'Performance.shares', className: 'Shares'},
  {title: 'Performance.posts', className: 'Posts'},
];
export const INSTAGRAM_COLUMN_NAMES = [
  {title: 'Performance.instagramChannels', className: 'Instagram Channels'},
  {title: 'Performance.followers', className: 'Followers'},
  {title: 'Performance.posts', className: 'Posts'},
];
export const TWITTER_COLUMN_NAMES = [
  {title: 'Performance.twitterChannels', className: 'Twitter Channels'},
  {title: 'Performance.retweets', className: 'Retweets'},
  {title: 'Performance.mentions', className: 'Mentions'},
  {title: 'Performance.followers', className: 'Followers'},
  {title: 'Performance.tweets', className: 'Tweets'},
];

export const DEFAULT_DOTS_COUNT = 7;

export const PERIOD = {
  PAST: 'past',
  CURRENT: 'current'
};
