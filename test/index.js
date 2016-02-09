"use strict";

var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

var Machine = require('../build/immutableStateMachine');

console.log(Machine.toString);


var test = module.exports = {};


test['state config'] = {
  'need to provide state config': function() {
    expect(function() {
      new Machine();
    }).to.throw('Atleast 2 states required');
  },

  'need to give an array': function() {
    expect(function() {
      new Machine('bla');
    }).to.throw('Atleast 2 states required');
  },

  'one state not enough': function() {
    expect(function() {
      new Machine(['bla']);
    }).to.throw('Atleast 2 states required');
  },

  'two states enough': function() {
    expect(function() {
      new Machine(['state1', 'state2']);
    }).to.not.throw('Atleast 2 states required');
  },

};

