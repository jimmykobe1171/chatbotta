import express from 'express';
import { Message } from '../data/models';
import { isAuthenticated } from '../core/middleware';
import { MESSAGE_TYPES } from '../data/models/constants';


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
      studentId,
      courseId,
      content,
      type: MESSAGE_TYPES.QUESTION,
    }).then((message) => {
      res.json({});
    }).catch((err) => {
      res.status(400).json({ error: err.errors[0].message });
    });
  } else {
    res.status(400).json({ error: 'should provide course id and student id and content' });
  }
});


export default router;
