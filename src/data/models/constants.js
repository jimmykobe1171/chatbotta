const USER_TYPES = {
  STUDENT: 'student',
  TA: 'ta',
  PROFESSOR: 'professor',
};

const MESSAGE_TYPES = {
  QUESTION: 'question',
  ANSWER: 'answer',
};

const MESSAGE_SENDER_TYPES = {
  TA: 'ta',
  PROFESSOR: 'professor',
  CHATBOT: 'chatbot',
};

const CHATBOT_ANSWER_STATUS = {
  HELPFUL: 'helpful',
  UNHELPFUL: 'unhelpful',
  IRRELEVANT: 'irrelevant',
};

const TA_ANSWER_STATUS = {
  RESOLVED: 'resolved',
  UNRESOLVED: 'unresolved',
};

export { USER_TYPES, MESSAGE_TYPES, MESSAGE_SENDER_TYPES, CHATBOT_ANSWER_STATUS, TA_ANSWER_STATUS };
