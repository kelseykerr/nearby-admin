'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';

var RequestSchema = new Schema({}, {
  strict: false,
  collection: 'request'
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

export default mongoose.model('request', RequestSchema);
