#!/usr/bin/env node

var _ = require('lodash');
var cp = require('child_process');
var mktmpio = require('../');

var args = _.takeWhile(process.argv, _.negate(literalSeparator)).slice(2);
var subShell = _.drop(process.argv, args.length + 3);

var instanceType = args[0];
mktmpio.create(instanceType, function(err, res) {
  console.log('err:', err);
  console.log('res:', res);
  if (err) {
    console.error('error creating instance:', err, res);
    return process.exit(1);
  }
  if (subShell.length <= 0) {
    subShell = res.remoteShell || subShell;
  }
  if (subShell.length > 0) {
    spawnSubShell(subShell, res, function(err) {
      console.log('subShell -> ', arguments);
      mktmpio.destroy(res.id, function(err, res) {
        console.error('destroyed', arguments);
      });
    });
  }
});

console.log('argv:', process.argv);
console.log('args:', args);
console.log('subShell:', subShell);

function spawnSubShell(cmd, instance, callback) {
  var env = _.mapKeys(instance, function(v, key) {
    console.log('key:', key);
    return instance.type.toUpperCase() + '_' + key.toUpperCase();
  });
  var opts = {
    env: _.defaults(env, process.env),
    stdio: 'inherit',
  };
  var child = cp.spawn(_.head(cmd), _.tail(cmd), opts);
  child.on('exit', callback);
  child.on('error', callback);
}

function literalSeparator(str) {
  return str === '--';
}
