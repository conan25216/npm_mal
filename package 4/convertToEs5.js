const fs = require('fs-extra');
const transform = require('babel-transform-dir');

const babelConfig = require('./.babelrc');

fs.copy('./src', './lib', () => {
  console.log('File copied');
  babelTransform()
    .then(() => {
      console.log('done');
    });
});

function babelTransform () {
  return new Promise((resolve, reject) => {
    console.log(babelConfig);
    return resolve(transform('./lib', './lib', {
      babel: babelConfig,
      // Invokes whenever a file is transformed and written.
      onFile: (file) => {
        console.log(`src/${file} -> lib/${file}`);
      }
    }));
  });
}
