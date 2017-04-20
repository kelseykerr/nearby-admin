'use strict';
import express from 'express';
import config from '../config/environment';
import AdminUser from '../api/admin-user/admin-user.model';

// Passport Configuration
require('./local/passport').setup(AdminUser, config);

var router = express.Router();

router.use('/local', require('./local').default);

export default router;
