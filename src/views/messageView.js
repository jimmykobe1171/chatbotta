import express from 'express';
import { Message } from '../data/models';
import { isAuthenticated } from '../core/middleware';
import { MESSAGE_TYPES, MESSAGE_SENDER_TYPES } from '../data/models/constants';
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
    Message.create({
      studentId: question.studentId,
      courseId: question.courseId,
      content: responseMsg,
      type: MESSAGE_TYPES.ANSWER,
      questionId: question.id,
      senderType: MESSAGE_SENDER_TYPES.CHATBOT,
    }).then((message) => {
      // do nothing
      console.log('create chatbot answer success');
    }).catch((err) => {
      console.log(err);
    });
}

function getApiaiResponseFail(error) {
    // do nothing
}


/*
 * get all messages related to specific user and course
 */
router.get('/Messages/', isAuthenticated, (req, res) => {
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
router.post('/Messages/', isAuthenticated, (req, res) => {
  const studentId = req.user.id;
  const courseId = req.body.courseId;
  const content = req.body.content;
  if (courseId && studentId && content) {
    Message.create({
      studentId: studentId,
      courseId: courseId,
      content: content,
      type: MESSAGE_TYPES.QUESTION,
    }).then((message) => {
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


export default router;
