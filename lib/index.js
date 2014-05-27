var colors = require('colors');
var path = require('path');
var spawn = require('child_process').spawn;
var watch = require('watch');

module.exports.tend = function(dir, rawCommand, options) {
  options = options || {};
  var pattern = options.pattern || '.';
  var filter = new RegExp(pattern, 'i');

  var ignoreHidden = options.ignoreHidden === true;
  var restart = options.restart === true;

  var args = rawCommand.split(' ');
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
