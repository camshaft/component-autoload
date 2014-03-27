/**
 * Module dependencies
 */

var fs = require('fs');
var glob = require('glob');
var envs = require('envs');
var Batch = require('batch');
var concat = require('unique-concat');

/**
 * Initialize the globbing plugin
 *
 * @param {Object} conf
 * @return {Function}
 */

exports = module.exports = function(conf) {
  var opts = conf || {};
  if (opts.config) return exports()(conf);

  var styles = opts.styles || envs('COMPONENT_STYLES', 'public/stylesheets');
  var images = opts.images || envs('COMPONENT_IMAGES', 'public/images');
  var fonts = opts.font || envs('COMPONENT_FONTS', 'public/images');

  var scripts = opts.scripts || envs('COMPONENT_SCRIPTS', 'public/javascripts');
  var partials = opts.partials || envs('COMPONENT_PARTIALS', 'public/partials');

  return function hook(builder) {
    builder.hook('before styles', function(pkg, done) {
      if (!pkg.root) return done();

      scan([
        styles + '/**.css',
        images + '/**',
        fonts + '/**'
      ], function(err, files) {
        if (err) return done(err);

        merge('styles', pkg, files[0]);
        merge('images', pkg, files[1]);
        merge('fonts', pkg, files[1]);

        var main = styles + '/index.styl';
        fs.exists(main, function(exists) {
          if (err) return done(err);
          if (exists) merge('styles', pkg, [main]);
          done();
        });
      });
    });

    builder.hook('before scripts', function(pkg, done) {
      if (!pkg.root) return done();

      scan([
        scripts + '/**.js',
        partials + '/**.(jade|html)'
      ], function(err, files) {
        if (err) return done(err);

        merge('scripts', pkg, files[0]);
        merge('partials', pkg, files[1]);

        done();
      });
    });
  };
};

/**
 * Scan over the list of directories and return the results
 */

function scan(arr, fn) {
  var batch = new Batch();

  arr.forEach(function(pattern) {
    batch.push(function(done) {
      glob(pattern, done);
    });
  });

  batch.end(fn);
}

/**
 * Merge results with existing config
 */

function merge(name, pkg, files) {
  pkg.config[name] = concat(pkg.config[name] || [], files);
}
