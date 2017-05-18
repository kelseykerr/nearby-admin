'use strict';

import UserFlag from './user-flag.model';
import config from '../../config/environment';
import User from '../user/user.model'
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

function getUser(userId) {
  var user = User.findById(userId).exec()
    .then(u => {
      if (!u) {
        return null;
      }
      return u;
    })
    .catch(err => {
      return null
    });
  return user;
}


/**
 * Get list of userFlags
 */
export function searchObjects(req, res) {
  var queryParams = req.query;
  var createdStart;
  var createdEnd;
  var limit = 25;
  var offset = 0;
  if (req.param('limit') !== undefined && req.param('limit') < limit) {
    limit = parseInt(req.param('limit'));
  }
  if (req.param('offset') !== undefined && req.param('offset') >= 0) {
    offset = parseInt(req.param('offset'));
  }
  if (queryParams.hasOwnProperty("createdStart")) {
    createdStart = queryParams.createdStart;
  }
  if (queryParams.hasOwnProperty("createdEnd")) {
    createdEnd = queryParams.createdEnd;
  }

  var mongoQuery = {};
  if (createdStart !== undefined && createdEnd !== undefined) {
    mongoQuery.reportedDate = {
      "$gte": new Date(createdStart),
      "$lt": new Date(createdEnd)
    };
  } else if (createdStart !== undefined) {
    mongoQuery.reportedDate = {
      "$gte": new Date(createdStart)
    };
  } else if (createdEnd !== undefined) {
    mongoQuery.reportedDate = {
      "$lt": new Date(createdEnd)
    };
  }
  if (req.param('status') !== undefined) {
    mongoQuery.status = req.param('status').toUpperCase();
  }

  return UserFlag.find(mongoQuery)
    .limit(limit)
    .skip(offset)
    .sort({
      reportedDate: 'asc'
    })
    .exec(function(err, userFlags) {
      UserFlag.count(mongoQuery).exec(function(err, count) {
        res.header('X-Total-Count', count).status(200).json(userFlags);
      })
    })
    /*.then(users => {
      res.status(200).json(users);
    })*/
    .catch(handleError(res));
}

/**
 * Get the userFlag and populate it with the user objects of the reporter and the reportee
 */
export function show(req, res, next) {
  var userFlagId = req.params.id;

  return UserFlag.findById(userFlagId).exec()
    .then(userFlag => {
      userFlag = userFlag.toObject();
      if (!userFlag) {
        return res.status(404).end();
      }
      var promise = User.findById(userFlag.reporterId).exec();
      promise.then(reporter => {
        if (reporter) {
          userFlag.reporter = reporter;
        }
        return User.findById(userFlag.userId).exec();
      }).then(user => {
        userFlag.user = user;
        res.json(userFlag);
      }).catch(err => next(err));
    })
    .catch(err => next(err));
}

export function update(req, res) {
  var userFlagBody = req.body;
  var id = userFlagBody._id;
  var userFlag = UserFlag.findById(id).exec().then(f => {
    if (!f) {
      return null;
    }
    return f;
  })

  var query = {
    '_id': id
  };
  req.newData = {};
  if (userFlagBody.status !== undefined) {
    req.newData.status = userFlagBody.status.toUpperCase();
  }
  if (userFlagBody.reviewerNotes !== undefined) {
    req.newData.reviewerNotes = userFlagBody.reviewerNotes;
    req.newData.reviewedDate = new Date();
  }
  UserFlag.findOneAndUpdate(query, req.newData, {
    upsert: false
  }, function(err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    return res.send("succesfully saved");
  });
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
