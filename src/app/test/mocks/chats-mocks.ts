
export const GENERAL_CHAT_MOCK = { venue_chat_model_id: { type: 'general', _id: 1} };

export const CHAT_MOCK = {
  venue_chat_model_id: {
    participants: [
      {
        participant_id: 2,
        display_name: 'name',
        image: 'url'
      }
    ],
    last_message: {
      time: 2,
      content: 'content'
    },
    type: 'chat',
    _id: 1
  }
};

export const EXPANDED_CHAT_MOCK = {
  venue_chat_model_id: {
    participants: [
      {
        participant_id: 2,
        display_name: 'name'
      }
    ],
    last_message: {
      time: 2,
    },
    type: 'general',
    _id: 1
  }
};

export const EXPANDED_CHAT_MOCK_A = {
  venue_chat_model_id: {
    participants: [
      {
        participant_id: 2,
        display_name: 'a'
      }
    ],

    type: 'general',
    _id: 1
  }
};

export const EXPANDED_CHAT_MOCK_B = {
  venue_chat_model_id: {
    participants: [
      {
        participant_id: 2,
        display_name: 'b'
      }
    ],
    type: 'general',
    _id: 1
  }
};

export const CHAT_WITH_MESS = {
  venue_chat_model_id: {
    last_message: {
      time: 2,
    },
    type: 'chat',
    _id: 1
  }
};

export const CHAT_WITHOUT_MESS = {
  venue_chat_model_id: {
    last_message: {
        time: undefined,
    },
    type: 'chat',
    _id: 1
  }
};

export const CHATS = [
  GENERAL_CHAT_MOCK
];

export const CHATS_MOCK_SORTED_BY_TIME = [
  {venue_chat_model_id: {last_message: {time: 2}}},
  {venue_chat_model_id: {last_message: {time: 1}}},
];

export const CHATS_MOCK = [
  {venue_chat_model_id: {last_message: {time: 1}}},
  {venue_chat_model_id: {last_message: {time: 2}}},
];

export const CHATS_MOCK_EXPANDED = [
  EXPANDED_CHAT_MOCK_B,
  EXPANDED_CHAT_MOCK_A
];

export const CHATS_MOCK_EXPANDED_SORTED = [
  EXPANDED_CHAT_MOCK_A,
  EXPANDED_CHAT_MOCK_B
];

export const ALL_CHATS = [
  CHAT_WITHOUT_MESS,
  CHAT_WITH_MESS,
  EXPANDED_CHAT_MOCK,
];

export const SORTED_CHATS = [
  EXPANDED_CHAT_MOCK,
  CHAT_WITH_MESS,
  CHAT_WITHOUT_MESS
];

