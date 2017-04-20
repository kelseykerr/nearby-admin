/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import AdminUser from '../api/admin-user/admin-user.model';
import User from '../api/user/user.model';

import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    AdminUser.find({}).remove()
      .then(() => {
        AdminUser.create({
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        })
        .then(() => console.log('finished populating admin users'))
        .catch(err => console.log('error populating admin users', err));
      });
  }
}
