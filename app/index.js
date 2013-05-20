'use strict';
var path = require('path'),
    util = require('util'),
    fs = require('fs'),
    yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.option('format', {
    desc: 'Select one of frameworks `Bootstrap` or `Foundation` for Roots.',
    type: String
  });

  this.format = options.format;
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor(argument) {
  if (this.format) {
    return;
  }

  var cb = this.async();
  var formats = ['bootstrap', 'foundation'];
  var prompts = [{
    name: 'format',
    message: 'In what format would you like the frameworks for Roots?',
    default: formats.join('/')
  }];

  this.format = formats[0];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    formats.forEach(function (opt) {
      if ((new RegExp(opt, 'i')).test(props.format)) {
        this.format = opt;
      }
    }, this);

    cb();
  }.bind(this));
};

Generator.prototype.createfile = function createfile() {
  var cb = this.async();

  var repo_names = {
    bootstrap: 'rootsstrap',
    foundation: 'rootsfoundation'
  };

  this.remote('konitter', repo_names[this.format], function(err, remote) {
    if (err) {
      return cb(err);
    }

    console.log('we copy files in ' + remote.cachePath + ' to current directory.');
    remote.directory('.');

    cb();
  });
};