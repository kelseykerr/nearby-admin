'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';

var UserFlagSchema = new Schema({
  reviewerNotes: String,
  reviewedDate: Date
}, {
  strict: false,
  collection: 'userFlag'
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

export default mongoose.model('userFlag', UserFlagSchema);
