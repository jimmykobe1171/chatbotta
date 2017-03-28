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

const User = Model.define('User', {
    id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataType.STRING,
        allowNull: false
    },
    email: {
        type: DataType.STRING,
        validate: { isEmail: true },
        unique: true,
        allowNull: false
    },
    password_hash: {
      type: DataType.STRING,
      allowNull: false
    },
    password: {
        type: DataType.VIRTUAL,
        set: function(val) {
            this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
            this.setDataValue('password_hash', this.salt + val);
        },
        validate: {
            isLongEnough: function(val) {
                if (val.length < 5) {
                    throw new Error("Please choose a longer password")
                }
            }
        }
    },
    type: {
        type: DataType.ENUM('student', 'ta', 'professor'),
        allowNull: false
    }
}, {
    indexes: [
        { fields: ['email'] },
    ],
});

export default User;
