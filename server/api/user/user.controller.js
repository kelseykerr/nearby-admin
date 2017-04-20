'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of nearby users
 */
export function index(req, res) {
  var queryParams = req.query;
  var createdStart;
  var createdEnd;
  var limit = 25;
  var offset = 0;
  if (req.param('limit') !== undefined && req.param('limit') < limit) {
    limit = req.param('limit');
  }
  if (req.param('offset') !== undefined && req.param('offset') >= 0) {
    offset = req.param('offset');
  }
  if (queryParams.hasOwnProperty("createdStart")){
    createdStart = queryParams.createdStart;
  }
  if (queryParams.hasOwnProperty("createdEnd")){
      createdEnd = queryParams.createdEnd;
    }

  var mongoQuery = {};
  if (createdStart !== undefined && createdEnd !== undefined) {
    mongoQuery.createdDate = {"$gte": new Date(createdStart), "$lt": new Date(createdEnd)};
  } else if (createdStart !== undefined) {
    mongoQuery.createdDate = {"$gte": new Date(createdStart)};
  } else if (createdEnd !== undefined) {
    mongoQuery.createdDate = {"$lt": new Date(createdEnd)};
  }

  return User.find(mongoQuery)
    .limit(limit)
    .skip(offset)
    .sort({
      createdDate: 'asc'
     })
    .exec(function(err, users) {
      User.count().exec(function(err, count) {
        res.header('X-Total-Count', count).status(200).json(users);
      })
    })
    /*.then(users => {
      res.status(200).json(users);
    })*/
    .catch(handleError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
