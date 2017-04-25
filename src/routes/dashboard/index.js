/**
 * /src/routes/dashboard/index.js
 *
 * Copyright © 2017-present Yuxuan Chen. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Dashboard from './Dashboard';

const title = 'Dashboard';

export default {

  path: '/dashboard',

  action() {
    return {
      title,
      component: <Dashboard />,
    };
  },

};
