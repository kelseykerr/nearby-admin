'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var UserSchema = new Schema({
}, {strict: false, collection: 'user'});

var validatePresenceOf = function(value) {
  return value && value.length;
};

export default mongoose.model('user', UserSchema);
