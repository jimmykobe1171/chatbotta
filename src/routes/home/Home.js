/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import robotImg from './robots-start.png';

class Home extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <img src={robotImg} width="350" height="380" alt="robots-start" />
          <div className={s.passage}>
            <h1>Meet the bots that will make learning GREAT again</h1>
            <p>Studies that looked at delayed vs. immediate feedback discovered that participants
            who were given immediate feedback showed a significantly larger increase in
            performance than those who had received delayed feedback.<br /><br />
            Our chatbots enable students to get answers right away using machine learning
            to parse through course materials. TAs and faculty are also relieved of routine
            question-answering.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
