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


const LectureMaterial = Model.define('LectureMaterial', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataType.STRING,
    allowNull: false,
  },
  description: {
    type: DataType.TEXT,
    allowNull: true,
  },
}, {
  indexes: [
        { fields: ['id', 'name'] },
  ],
  instanceMethods: {

  },
});

export default LectureMaterial;
