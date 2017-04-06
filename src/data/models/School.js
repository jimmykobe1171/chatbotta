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

// const saltRounds = 10;

const School = Model.define('School', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  schoolname: {
    type: DataType.STRING,
    allowNull: false,
  },
  domain: {
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  indexes: [
        { fields: ['domain'] },
  ],
});

export default School;
