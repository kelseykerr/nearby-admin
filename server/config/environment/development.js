'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://nearby-alpha-server:XWiPkxgzfbBTpnhT@cluster0-shard-00-00-rdvis.mongodb.net:27017,cluster0-shard-00-01-rdvis.mongodb.net:27017,cluster0-shard-00-02-rdvis.mongodb.net:27017/nearby-alpha?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
  },

  // Seed database on startup
  seedDB: true

};
