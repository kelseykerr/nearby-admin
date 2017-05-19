'use strict';

import ResponseFlag from './response-flag.model';
import config from '../../config/environment';
import User from '../user/user.model';
import Response from '../response/response.model';
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

  return ResponseFlag.find(mongoQuery)
    .limit(limit)
    .skip(offset)
    .sort({
      reportedDate: 'asc'
    })
    .exec(function(err, responseFlags) {
      ResponseFlag.count(mongoQuery).exec(function(err, count) {
        res.header('X-Total-Count', count).status(200).json(responseFlags);
      })
    })
    .catch(handleError(res));
}

/**
 * Get the userFlag and populate it with the user objects of the reporter and the reportee
 */
export function show(req, res, next) {
  var responseFlagId = req.params.id;

  return ResponseFlag.findById(responseFlagId).exec()
    .then(respFlag => {
      respFlag = respFlag.toObject();
      console.log(respFlag);
      if (!respFlag) {
        return res.status(404).end();
      }
      var promise = Response.findById(respFlag.responseId).exec();
      promise.then(resp => {
        console.log(resp);
        if (resp) {
          respFlag.response = resp;
          resp = resp.toObject();
        }
        return User.findById(resp.sellerId).exec();
        //res.json(respFlag);
      }).then(user => {
        respFlag.user = user;
        res.json(respFlag);
      }).catch(err => next(err));
    })
    .catch(err => next(err));
}

export function update(req, res) {
  var respFlagBody = req.body;
  var id = respFlagBody._id;
  var respFlag = ResponseFlag.findById(id).exec().then(f => {
    if (!f) {
      return null;
    }
    return f;
  })

  var query = {
    '_id': id
  };
  req.newData = {};
  if (respFlagBody.status !== undefined) {
    req.newData.status = respFlagBody.status.toUpperCase();
  }
  if (respFlagBody.reviewerNotes !== undefined) {
    req.newData.reviewerNotes = respFlagBody.reviewerNotes;
    req.newData.reviewedDate = new Date();
  }
  ResponseFlag.findOneAndUpdate(query, req.newData, {
    upsert: false
  }, function(err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    if (req.newData.status === 'INAPPROPRIATE') {
      req.update = {}
      req.update.inappropriate = true;
      query = {
        '_id': respFlagBody.responseId
      };
      Response.findOneAndUpdate(query, req.update, {
        upsert: false
      }, function(err, doc) {
        return res.send("succesfully saved");
      });
    } else {
      return res.send("succesfully saved");
    }
  });
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
