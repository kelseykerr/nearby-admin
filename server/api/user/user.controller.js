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

  var mongoQuery = {};
  if (radius != undefined && lng != undefined && lat != undefined) {
    mongoQuery.homeLocation = {
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
    mongoQuery.createdDate = {
      "$gte": new Date(createdStart),
      "$lt": new Date(createdEnd)
    };
  } else if (createdStart !== undefined) {
    mongoQuery.createdDate = {
      "$gte": new Date(createdStart)
    };
  } else if (createdEnd !== undefined) {
    mongoQuery.createdDate = {
      "$lt": new Date(createdEnd)
    };
  }

  return User.find(mongoQuery)
    .limit(limit)
    .skip(offset)
    .sort({
      createdDate: 'asc'
    })
    .exec(function(err, users) {
      User.count(mongoQuery).exec(function(err, count) {
        res.header('X-Total-Count', count).status(200).json(users);
      })
    })
    /*.then(users => {
      res.status(200).json(users);
    })*/
    .catch(handleError(res));
}

export function graph(req, res) {
  var queryParams = req.query;
  var createdStart;
  var createdEnd;
  var interval = "weekly";
  var xAxis = [];
  var yAxis = [];
  if (queryParams.hasOwnProperty("createdStart")) {
    createdStart = queryParams.createdStart;
  }
  if (queryParams.hasOwnProperty("createdEnd")) {
    createdEnd = queryParams.createdEnd;
  }
  if (queryParams.hasOwnProperty("interval")) {
    if (queryParams.interval === "daily" || queryParams.interval === "weekly" || queryParams.interval === "monthly") {
      interval = queryParams.interval;
    }
  }
  var radius = req.param('radius');
  var lng = req.param('longitude');
  var lat = req.param('latitude');

  var mongoQuery = {};
  if (radius != undefined && lng != undefined && lat != undefined) {
    mongoQuery.homeLocation = {
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
    mongoQuery.createdDate = {
      "$gte": new Date(createdStart),
      "$lt": new Date(createdEnd)
    };
  } else if (createdStart !== undefined) {
    mongoQuery.createdDate = {
      "$gte": new Date(createdStart)
    };
  } else if (createdEnd !== undefined) {
    mongoQuery.createdDate = {
      "$lt": new Date(createdEnd)
    };
  }

  var mapFn = function() {
    var dt = this._id.getTimestamp();
    var dt_str = '';
    if (interval === 'monthly') {
      var yr = dt.getFullYear();
      var mo = dt.getMonth() + 1;
      dt_str = yr + '-' + ((mo < 10) ? '0' + mo : mo);
    } else { //assume daily for now
      var yr = dt.getFullYear();
      var mo = dt.getMonth() + 1;
      var dy = dt.getDate();
      dt_str = yr + '-' + ((mo < 10) ? '0' + mo : mo) + '-' + ((dy < 10) ? '0' + dy : dy);
    }
    console.log(dt_str + '**dt str');
    emit(dt_str, {
      count: 1
    });
  };
  var redFn = function(k, v) {
    var total = 0;
    console.log('***k: ' + k);
    console.log('***v: ' + v);
    if (v === undefined) {

    } else {
      v.forEach(function(value) {
        total += value['count'];
      });
    }

    return {
      count: total
    };
  };

  var options = {
    out: {
      replace: 'collectionName'
    },
    query: {
      mongoQuery
    }
  }

  return User.mapReduce({
    map: mapFn,
    reduce: redFn,
    options: {
      out: {
        replace: 'collectionName'
      },
      query: {
        mongoQuery
      }
    }
  }, function(err, results) {
    res.status(200).json(results);

    /*if (err != null) {
      console.log(err);
      next(err);
    } else {
      res.json(results);
    }*/
  });

}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
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

  return User.findOne({
      _id: userId
    }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
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
