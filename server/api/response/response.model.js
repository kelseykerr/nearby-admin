'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';

var ResponseSchema = new Schema({}, {
  strict: false,
  collection: 'response'
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

export default mongoose.model('response', ResponseSchema);
