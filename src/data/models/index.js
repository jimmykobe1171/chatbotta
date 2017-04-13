/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import sequelize from '../sequelize';
import User from './User';
import School from './School';
import Course from './Course';
import Lecture from './Lecture';
import LectureMaterial from './LectureMaterial';

// define relationships
School.hasMany(User);

const UserCourse = sequelize.define('UserCourse', {
  joinType: {
    type: DataType.ENUM('student', 'ta', 'professor'),
    allowNull: false,
  },
});
Course.belongsToMany(User, {
  through: UserCourse,
});
User.belongsToMany(Course, {
  through: UserCourse,
});

Lecture.hasMany(LectureMaterial);

Course.hasMany(Lecture);

School.hasMany(Course);

// User.hasMany(UserLogin, {
//   foreignKey: 'userId',
//   as: 'logins',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
// });


// User.hasOne(UserProfile, {
//   foreignKey: 'userId',
//   as: 'profile',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
// });

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, School, Course, Lecture, LectureMaterial, UserCourse };
