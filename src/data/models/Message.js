/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import { MESSAGE_SENDER_TYPES, MESSAGE_TYPES, CHATBOT_ANSWER_STATUS, TA_ANSWER_STATUS } from './constants';
import User from './User';
import Course from './Course';


const Message = Model.define('Message', {
  content: {
    type: DataType.TEXT,
    allowNull: false,
  },
  studentId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
     // This is a reference to another model
      model: User,
     // This is the column name of the referenced model
      key: 'id',
    },
  },
  studentEmail: {
    type: DataType.STRING,
    allowNull: true,
  },
  courseId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
     // This is a reference to another model
      model: Course,
     // This is the column name of the referenced model
      key: 'id',
    },
  },
  type: {
    type: DataType.ENUM(MESSAGE_TYPES.QUESTION, MESSAGE_TYPES.ANSWER),
    allowNull: false,
  },
  senderId: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
     // This is a reference to another model
      model: User,
     // This is the column name of the referenced model
      key: 'id',
    },
  },
  questionId: {
    type: DataType.INTEGER,
    allowNull: true,
  },
  senderType: {
    type: DataType.ENUM(MESSAGE_SENDER_TYPES.TA, MESSAGE_SENDER_TYPES.PROFESSOR, MESSAGE_SENDER_TYPES.CHATBOT),
    allowNull: true,
  },
  chatbotAnswerStatus: {
    type: DataType.ENUM(CHATBOT_ANSWER_STATUS.HELPFUL, CHATBOT_ANSWER_STATUS.UNHELPFUL, CHATBOT_ANSWER_STATUS.IRRELEVANT),
    allowNull: true,
  },
  taAnswerStatus: {
    type: DataType.ENUM(TA_ANSWER_STATUS.RESOLVED, TA_ANSWER_STATUS.UNRESOLVED),
    allowNull: true,
  },
}, {
  indexes: [
        { fields: ['id', 'studentId'] },
  ],
  instanceMethods: {

  },
});

export default Message;
