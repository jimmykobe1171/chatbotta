import express from 'express';
import { Message, User } from '../data/models';
import { isAuthenticated } from '../core/middleware';
import { MESSAGE_TYPES, MESSAGE_SENDER_TYPES, CHATBOT_ANSWER_STATUS, TA_ANSWER_STATUS } from '../data/models/constants';
import apiaiApp from '../core/apiai';

// const express = require('express');
const router = express.Router();


// function get_messages_data(messages) {
//   const data = [];
//   for (let i=0; i<messages.length; i++) {
//     const message = messages[i];
//     data.push({
//       id: message.id,
//       content: message.content,
//       studentId: message.studentId,
//       courseId: message.courseId,
//       type: message.type,
//       dateCreated: message.createdAt,
//       dateUpdated: message.updatedAt,
//     });
//   }
//   return data
// }


function getApiaiResponseSuccess(question, response) {
    const responseMsg = response.result.fulfillment.speech;
    getUserById(question.studentId)
    .then((student) => {
      return Message.create({
        studentId: question.studentId,
        studentEmail: student.email,
        courseId: question.courseId,
        content: responseMsg,
        type: MESSAGE_TYPES.ANSWER,
        questionId: question.id,
        senderType: MESSAGE_SENDER_TYPES.CHATBOT,
      });
    })
    .then((message) => {
      // do nothing
      console.log('create chatbot answer success');
    }).catch((err) => {
      console.log(err);
    });
}

function getApiaiResponseFail(error) {
    // do nothing
}

function getUserById(userId) {
  return User.findById(userId);
}


/*
 * get all messages related to specific user and course
 */
router.get('/messages/', isAuthenticated, (req, res) => {
  const studentId = req.query.userId || req.user.id;
  const courseId = req.query.courseId;
  if (courseId && studentId) {
    Message.findAll({
      where: {
        studentId,
        courseId,
      },
    }).then((messages) => {
      // const data = get_messages_data(messages);
      const data = messages;
      res.json(data);
    }).catch((err) => {
      res.status(400).json({ error: 'query messages failed!' });
    });
  } else {
    res.status(400).json({ error: 'should provide course id and student id' });
  }
});

/*
 * post messages related to specific user and course
 */
router.post('/messages/', isAuthenticated, (req, res) => {
  const studentId = req.user.id;
  const courseId = req.body.courseId;
  const content = req.body.content;
  if (courseId && studentId && content) {
    getUserById(studentId)
    .then((student) => {
      return  Message.create({
        studentId: studentId,
        studentEmail: student.email,
        courseId: courseId,
        content: content,
        type: MESSAGE_TYPES.QUESTION,
      });
    })
   .then((message) => {
      // connect with api.ai
      apiaiApp.getResponse(content, getApiaiResponseSuccess.bind(null, message), getApiaiResponseFail);
      res.json({});
    }).catch((err) => {
      console.log(err);
      res.status(400).json({ error: 'send message failed' });
    });
  } else {
    res.status(400).json({ error: 'should provide course id and student id and content' });
  }
});


/*
 * update answer chatbotAnswerStatus or taAnswerStatus
 */
router.put('/messages/:messageId/', isAuthenticated, (req, res) => {
  const chatbotAnswerStatus = req.body.chatbotAnswerStatus;
  const taAnswerStatus = req.body.taAnswerStatus;
  const data = {};
  const fields = [];
  let questionId = null;
  if (chatbotAnswerStatus && taAnswerStatus) {
    res.status(400).json({ error: 'should not update chatbotAnswerStatus and taAnswerStatus at same time' });
  }
  else if (chatbotAnswerStatus || taAnswerStatus) {
    if (chatbotAnswerStatus) {
      data.chatbotAnswerStatus = chatbotAnswerStatus;
      fields.push('chatbotAnswerStatus');
    }
    if (taAnswerStatus) {
      data.taAnswerStatus = taAnswerStatus;
      fields.push('taAnswerStatus');
    }
    Message.findById(req.params.messageId)
    .then((message) => {
      questionId = message.questionId;
      return message.update(data, fields);
    })
    .then(() => {
      // find related question
      return Message.findById(questionId);
    })
    .then((question) => {
      // update question status
      return question.update(data, fields);
    })
    .then(() => {
      res.json({});
    })
    .catch((err) => {
      res.status(400).json({ error: 'update message failed' });
    });
  }
  else {
    res.status(400).json({ error: 'valid fields are chatbotAnswerStatus and taAnswerStatus' });
  }
});


/*
 * get all questions related to specific course. For TA and professor use.
 */
router.get('/questions/', isAuthenticated, (req, res) => {
  const courseId = req.query.courseId;
  const isTA = req.query.isTA == 'true'? true:false;
  let whereOption = null;
  if (courseId) {
    if (isTA) {
      whereOption = {
        courseId: courseId,
        type: MESSAGE_TYPES.QUESTION,
        chatbotAnswerStatus: {
          $in: [CHATBOT_ANSWER_STATUS.UNHELPFUL, CHATBOT_ANSWER_STATUS.IRRELEVANT]
        },
        taAnswerStatus: null
      };
    }
    else {
      whereOption = {
        courseId: courseId,
        type: MESSAGE_TYPES.QUESTION,
        taAnswerStatus: TA_ANSWER_STATUS.UNRESOLVED
      };
    }
    Message.findAll({
      where: whereOption,
    }).then((messages) => {
      // const data = get_messages_data(messages);
      const data = messages;
      res.json(data);
    }).catch((err) => {
      res.status(400).json({ error: 'query questions failed!' });
    });
  } else {
    res.status(400).json({ error: 'should provide course id' });
  }
});

/*
 * get question and its answers.
 */
router.get('/questions/:questionId/', isAuthenticated, (req, res) => {
  const questionId = req.params.questionId;
  Message.findAll({
    where: {
      $or: [
        {
          id: questionId
        },
        {
          questionId: questionId
        }
      ]
    },
  }).then((messages) => {
    // const data = get_messages_data(messages);
    const data = messages;
    res.json(data);
  }).catch((err) => {
    res.status(400).json({ error: 'query question failed!' });
  });
});

/*
 * post answer to question, for TA and professor dashboard.
 */
router.post('/answers/', isAuthenticated, (req, res) => {
  const senderId = req.user.id;
  const isTA = req.body.isTA? true:false;
  const questionId = req.body.questionId;
  const content = req.body.content;
  let question = null;
  if (questionId && content && isTA != null) {
    Message.findById(questionId)
    .then((question1) => {
      question = question1;
      return getUserById(question.studentId);
    })
    .then((student) => {
      const senderType = isTA? MESSAGE_SENDER_TYPES.TA: MESSAGE_SENDER_TYPES.PROFESSOR;
      return Message.create({
        studentId: question.studentId,
        studentEmail: student.email,
        courseId: question.courseId,
        content: content,
        type: MESSAGE_TYPES.ANSWER,
        questionId: question.id,
        senderType: senderType,
        senderId: senderId,
      });
    })
    .then(() => {
      res.json({});
    }).catch((err) => {
      console.log(err);
      res.status(400).json({ error: 'create answer failed' });
    });
  } else {
    res.status(400).json({ error: 'should provide question id, isTA and content' });
  }
});


export default router;
