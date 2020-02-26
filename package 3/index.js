var https = require('https');

exports.create = createInstance;
exports.destroy = destroyInstance;

function createInstance(instanceType, callback) {
  https.request({
    hostname: 'mktmp.io',
    port: 443,
    path: '/api/v1/new/' + instanceType,
    method: 'POST',
    headers: {
      'X-Auth-Token': process.env.MKTMPIO_TOKEN,
      'User-Agent': 'mktmpio/' + require('./package.json').version,
    },
  }, function(res) {
    collectJSON(res, callback);
  }).end();
}

function destroyInstance(instanceId, callback) {
  https.request({
    hostname: 'mktmp.io',
    port: 443,
    path: '/api/v1/i/' + instanceId,
    method: 'DELETE',
    headers: {
      'X-Auth-Token': process.env.MKTMPIO_TOKEN,
      'User-Agent': 'mktmpio/' + require('./package.json').version,
    },
  }, function(res) {
    collectJSON(res, callback);
  }).end();
}

function collectJSON(res, callback) {
  var buf = '';
  res.on('data', function(d) {
    buf += d;
  });
  res.on('end', function() {
    var err = null;
    try {
      buf = buf.length > 0 ? JSON.parse(buf) : {};
    } catch (e) {
      err = e;
    }
    callback(err, buf);
  });
}
