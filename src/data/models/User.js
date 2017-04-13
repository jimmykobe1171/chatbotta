/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import bcrypt from 'bcrypt';
import DataType from 'sequelize';
import Model from '../sequelize';

const saltRounds = 10;

const User = Model.define('User', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataType.STRING,
    allowNull: false,
  },
  email: {
    type: DataType.STRING,
    validate: { isEmail: true },
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataType.STRING,
    allowNull: false,
  },
  password: {
    type: DataType.VIRTUAL,
    set(val) {
      this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
      // generate hash
      const hash = bcrypt.hashSync(val, saltRounds);
      this.setDataValue('passwordHash', hash);
    },
    validate: {
      isLongEnough(val) {
        if (val.length < 5) {
          throw new Error('Please choose a longer password');
        }
      },
    },
  },
  // type: {
  //   type: DataType.ENUM('student', 'ta', 'professor'),
  //   allowNull: false,
  // },
}, {
  indexes: [
        { fields: ['email'] },
  ],
  instanceMethods: {
    authenticate(password) {
      const hash = this.getDataValue('passwordHash');
      return bcrypt.compareSync(password, hash);
    },
  },
});

export default User;
