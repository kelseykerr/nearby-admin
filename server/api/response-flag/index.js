'use strict';

import {
  Router
} from 'express';
import * as controller from './response-flag.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(), controller.searchObjects);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.isAuthenticated(), controller.update);

module.exports = router;
