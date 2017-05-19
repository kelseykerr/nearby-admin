'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';

var ResponseFlagSchema = new Schema({
  reviewerNotes: String,
  reviewedDate: Date
}, {
  strict: false,
  collection: 'responseFlag'
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

export default mongoose.model('responseFlag', ResponseFlagSchema);
