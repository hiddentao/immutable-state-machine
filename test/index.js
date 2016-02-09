"use strict";

var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

var Machine = require('../build/immutableStateMachine');



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

  'cannot have same state twice - 1': function() {
    expect(function() {
      new Machine(['state1', 'state1']);
    }).to.throw('State already defined: state1');
  },

  'cannot have same state twice - 2': function() {
    expect(function() {
      new Machine(['state1', { id: 'state1' }]);
    }).to.throw('State already defined: state1');
  },

};


test['initial state'] = {
  'first by default': function() {
    var m = new Machine(['start', 'stop']);

    m.getState().should.eql('start');
  },
  'can be overridden': function() {
    var m = new Machine([
      'start', 
      {
        id: 'stop',
        initial: true,
      },
    ]);

    m.getState().should.eql('stop');
  },
}



test['goto state'] = {
  'to same state': function() {
    var m = new Machine(['start', 'stop']);

    m.getState().should.eql('start');
    expect(m.getData()).to.eql.null;

    var m2 = m.goto('start');

    m2.should.eql(m);

    m2.getState().should.eql('start');
    expect(m2.getData()).to.eql.null;
  },

  'to same state with new data': function() {
    var m = new Machine(['start', 'stop']);

    var m2 = m.goto('start', {
      dummy: true,
    });

    m2.should.not.eql(m);

    m2.getState().should.eql('start');
    expect(m2.getData()).to.eql({ dummy: true });

    // previous instance unchanged
    m.getState().should.eql('start');
    expect(m.getData()).to.eql.null;
  },

  'to new state': function() {
    var m = new Machine(['start', 'stop']);

    var m2 = m.goto('stop', {
      dummy: true,
    });

    m2.should.not.eql(m);

    m2.getState().should.eql('stop');
    expect(m2.getData()).to.eql({ dummy: true });

    // previous instance unchanged
    m.getState().should.eql('start');
    expect(m.getData()).to.eql.null;
  },

  'invalid state': function() {
    var m = new Machine([
      'start',
      'finish'
    ]);

    expect(function() {
      m.goto('bed');
    }).to.throw('Invalid state: bed');
  },

  'restriction - to': function() {
    var m = new Machine([
      {
        id: 'start', 
        to: ['finish'],
      },
      'bed',
      'finish'
    ]);

    expect(function() {
      m.goto('bed');
    }).to.throw('Disallowed transition: start -> bed');
  },

  'restriction - from': function() {
    var m = new Machine([
      'start',
      {
        id: 'bed',
        from: ['finish']
      },
      'finish',
    ]);

    expect(function() {
      m.goto('bed');
    }).to.throw('Disallowed transition: start -> bed');
  },
}



