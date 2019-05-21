export const COLUMNS_CONSTANTS  = [
  'Performance.source',
  'Performance.number',
  'Performance.comparedPrev',
  'Performance.comparisonPrev%'
];

export const SOURCE = {
  WEB_TRAFFIC: 'web-traffic',
  BOOKING: 'booking',
  CALLS_RECIEVED: 'calls-recieved',
  REACH: 'social-reach',
  LIKES: 'social-likes',
  COMMENTS: 'social-comments',
  SHARES: 'social-shares',
  REVIEWS_RECIEVED: 'reviews-recieved',
  RELEVANT_EVENTS_SCORE: 'relevant-events-score'
};

export const TABLE_CONSTANTS  = [
  { selected: true, icon: SOURCE.WEB_TRAFFIC, name: SOURCE.WEB_TRAFFIC, label: 'Performance.tableWebTraffic' },
  { selected: true, icon: SOURCE.BOOKING,  name: SOURCE.BOOKING, label: 'Performance.tableBooking' },
  { selected: true, icon: SOURCE.CALLS_RECIEVED, name: SOURCE.CALLS_RECIEVED, label: 'Performance.tableCallRecieved' },
  { selected: true, icon: SOURCE.REACH, name: SOURCE.REACH, label: 'Performance.tableReach' },
  { selected: true, icon: SOURCE.LIKES,  name: SOURCE.LIKES, label: 'Performance.tableLikes' },
  { selected: true, icon: SOURCE.COMMENTS, name: SOURCE.COMMENTS, label: 'Performance.tableComments' },
  { selected: true, icon: SOURCE.SHARES, name: SOURCE.SHARES,  label: 'Performance.tableShares' },
  { selected: true, icon: SOURCE.REVIEWS_RECIEVED,  name: SOURCE.REVIEWS_RECIEVED,  label: 'Performance.tableReviewsRecieved' },
  { selected: true, icon: SOURCE.RELEVANT_EVENTS_SCORE, name: SOURCE.RELEVANT_EVENTS_SCORE,  label: 'Performance.tableRelevantEventsScore' }
];


export const METRICS = [
  'post_impressions_paid_unique',
  'post_impressions_organic_unique',
  'post_shares',
  'post_comments',
  'post_likes'
];
