var colors = require('colors');
var parse = require('shell-quote').parse;
var path = require('path');
var rc = require('rc');
var spawn = require('child_process').spawn;
var watch = require('watch');

module.exports.tend = function(dir, rawCommand, options) {
  options = options || {};
  var pattern = options.filter || '.';
  var filter = new RegExp(pattern, 'i');

  var ignoreHidden = options.ignoreHidden === true;
  var restart = options.restart === true;

  var args = parse(rawCommand);
  var command = args.shift();
  var executor = null;
  var timeout = null;

  var startCommand = function() {
    console.log(('Running Command: ' + rawCommand).green);
    executor = spawn(command, args);
    executor.stdout.on('data', function(chunk) {
      console.log(chunk.toString());
    });
    executor.stderr.on('data', function(chunk) {
      console.error(chunk.toString().red);
    });
    executor.on('error', function(error) {
      console.error('Error Running Command'.red);
    });
    executor.on('close', function(code, signal) {
      if (code === 0) {
        console.log('Command Exited Successfully'.green);
      } else if (signal) {
        console.warn(('Command Killed With Signal: ' + signal).yellow);
      } else {
        console.error(('Command Exited With Status: ' + code).red);
      }
      executor = null;
    });
    console.log(('Process ' + executor.pid + ' Started').green);
  }.bind(this);

  watch.watchTree(dir, function(f, curr, prev) {
    if (curr === null && prev === null) {
      return;
    }
    if (ignoreHidden) {
      var basename = path.basename(f);
      if (basename.indexOf('.') === 0) {
        return;
      }
    }
    if (!filter.test(f)) {
      return;
    }

    if (executor && restart) {
      console.warn(('Killing Process: ' + executor.pid).yellow);
      executor.on('close', function(code, signal) {
        startCommand();
      });
      executor.kill();
      return;
    } else if (executor) {
      console.warn(('Process ' + executor.pid + ' Still Running').yellow);
      return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(startCommand, 300);
  });
};

module.exports.parseConfig = function() {
  var config = {};
  var rawConfig = rc('tend', {}, {});

  var defaults = {
    filter: rawConfig.filter || '.',
    ignoreHidden: (rawConfig.ignoreHidden === undefined) ? false : rawConfig.ignoreHidden,
    restart: (rawConfig.restart === undefined) ? false : rawConfig.restart,
  };

  for (var key in rawConfig) {
    if (!(rawConfig[key] instanceof Object)) {
      continue;
    }
    var section = rawConfig[key];
    if (!section.directory) {
      console.error('Section[' + key + '] missing "directory" setting');
      continue;
    } else if (!section.command) {
      console.error('Section[' + key + '] missing "command" setting');
      continue;
    }
    config[key] = {
      filter: (section.filter === undefined) ? defaults.filter : section.filter,
      ignoreHidden: (section.ignoreHidden === undefined) ? defaults.ignoreHidden : section.ignoreHidden,
      restart: (section.restart === undefined) ? defaults.restart : section.restart,
      directory: section.directory,
      command: section.command
    };
  }

  if (!Object.keys(config).length) {
    return false;
  }
  return config;
};
