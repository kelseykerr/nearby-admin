'use strict';

import Request from './request.model';
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
  var radius = req.param('radius');
  var lng = req.param('longitude');
  var lat = req.param('latitude');
  var status = req.param('status');

  var mongoQuery = {};
  if (radius != undefined && lng != undefined && lat != undefined) {
    mongoQuery.location = {
      "$near": {
        "$geometry": {
          "type": "Point",
          "coordinates": [parseFloat(lng), parseFloat(lat)]
        },
        "$maxDistance": parseFloat(radius) * 1609.344
      }
    }
  }
  if (createdStart !== undefined && createdEnd !== undefined) {
    mongoQuery.postDate = {
      "$gte": new Date(createdStart),
      "$lt": new Date(createdEnd)
    };
  } else if (createdStart !== undefined) {
    mongoQuery.postDate = {
      "$gte": new Date(createdStart)
    };
  } else if (createdEnd !== undefined) {
    mongoQuery.postDate = {
      "$lt": new Date(createdEnd)
    };
  }
  if (status !== undefined) {
    mongoQuery.status = {
      "$eq": status
    }
  }

  return Request.find(mongoQuery)
    .limit(limit)
    .skip(offset)
    .sort({
      createdDate: 'asc'
    })
    .exec(function(err, users) {
      Request.count(mongoQuery).exec(function(err, count) {
        res.header('X-Total-Count', count).status(200).json(users);
      })
    })
    /*.then(users => {
      res.status(200).json(users);
    })*/
    .catch(handleError(res));
}


/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
