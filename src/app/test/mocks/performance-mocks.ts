export const SELECTED_CHANNEL = {
  channel: {
    name: '25th Ward Restaurant',
    network: 'facebook',
    _id: '1861178523910815'
  },
  metrics: {
    facebook_total_reach: 25279,
    facebook_total_reach_gain: 2,
    fb_post_count: 0,
    fb_post_count_gain_percent: 0,
    page_impressions_organic_unique: 10501,
    page_impressions_organic_unique_gain: 445,
    page_impressions_organic_unique_gain_percent: 4,
    page_impressions_paid_unique: 14778,
    page_impressions_paid_unique_gain: 0,
    page_impressions_paid_unique_gain_percent: 0,
    post_comments: 10,
    post_comments_gain: 0,
    post_comments_gain_percent: 0,
    post_likes: 1609,
    post_likes_gain: 2,
    post_likes_gain_percent: 0,
    post_shares: 20,
    post_shares_gain: 0,
    post_shares_gain_percent: 0,
  },
  name: '25th Ward Restaurant',
  network: 'facebook',
  paidPercent: 58,
};

export const METRICS_ARRAY = [
  {metric: 'post_shares', total: 282},
  {metric: 'post_comments', total: 169},
  {metric: 'post_likes', total: 1066},
  {metric: 'page_impressions_paid_unique', total: 20261},
  {metric: 'page_impressions_organic_unique', total: 102731},
  {metric: 'fb_post_count', total: 0},
  {metric: 'post_shares_gain', total: 1},
  {metric: 'post_comments_gain', total: 0},
  {metric: 'post_likes_gain', total: -1},
  {metric: 'page_impressions_paid_unique_gain', total: 0},
  {metric: 'page_impressions_organic_unique_gain', total: 3156}
];

export const PERFORMANCE_POST = {
  channel: {
    _id: '459058760930639', name: 'Bar Eight, Manchester', network: 'facebook'
  },
  name: 'Bar Eight, Manchester',
  network: 'facebook',
  _id: '459058760930639',
  metrics: METRICS_ARRAY,
};



export const PERFORMANCE_POSTS = {
  code: 200,
  list: [
    PERFORMANCE_POST
  ]
};

export const METRICS = [
  {metric: 'post_impressions_organic_unique', total: 400},
  {metric: 'post_impressions_paid_unique', total: 200},
  {metric: 'post_likes', total: 2},
  {metric: 'post_comments', total: 0},
  {metric: 'post_shares', total: 0},
] as any;

export const POST = {
  metrics: METRICS,
};

export const CHART_DATA = [
  [ new Date('2018-10-01'), 0 , 0 ],
  [ new Date('2018-10-02'), 1 , 0 ],
  [ new Date('2018-10-03'), 2 , 0 ],
  [ new Date('2018-10-04'), 3 , 0 ],
  [ new Date('2018-10-05'), 4 , 0 ],
  [ new Date('2018-10-06'), 5 , 0 ],
  [ new Date('2018-10-07'), 6 , 0 ],
];
