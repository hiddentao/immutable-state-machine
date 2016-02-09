# Immutable state machine

[![Build Status](https://secure.travis-ci.org/hiddentao/immutable-state-machine.png)](http://travis-ci.org/hiddentao/immutable-state-machine)

A simple yet flexible _immutable_ [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) for Javascript. Great for when building with frameworks like 
[React](https://facebook.github.io/react/).

Features:

* Works in Node.js and the browser.
* Immutability - use simple object equality to check if state changed.
* Restrict state transitions using from/to rules.
* Store additional data alongside each state.
* Very small (<2 KB).


## Installation

### CommonJS

Install using [npm](http://npmjs.org/):

  $ npm install immutable-state-machine

### Browser

Include the `build/immutableStateMachine.js` script.

In the browser the library is exposed via the `ImmutableStateMachine` class function.

## How to use

### The basics - states and data

Let's create a machine with two states - `start` and `stop`:

```javascript
var Machine = require('immutable-state-machine');

/*
We'll have two states - "start" and "stop"
*/
var m = new Machine([
  'start',
  'stop'
]);

console.log( m.getState() );      // "start"
console.log( m.getData() );       // null
```

By default the first state passed-in (`start`) is the initially active state. 
The data associated with a state is initially always `null`. 

If needed we can explicitly set the initial state:

```javascript
var m = new Machine([
  'start',
  {
    id: 'stop',
    initial: true,
  }
]);

console.log( m.getState() );      // "stop"
```

Now let's goto a new state and see what happens:

```javascript
var m = new Machine([
  'start',
  'start'
]);

var m2 = m.goto('stop');

console.log( m2 === m );      // false
console.log( m2.getState() ); // "stop"
console.log( m.getState() );  // "start"
```

As expected according to _immutability_, it returned a new instance of the 
machine, leaving the original unchanged. 

Instead, what if we went to the same state?

```javascript
var m = new Machine([
  'start',
  'start'
]);

var m2 = m.goto('start');

console.log( m2 === m );      // true

console.log( m2.getState() ); // "start"
console.log( m2.getData() ); // null
```

The same instance gets returned back as expected. But if we goto the same state 
with different data a new instance will be returned:

```javascript
var m = new Machine([
  'start',
  'start'
]);

var m2 = m.goto('start', {
  some: 'data'
});

console.log( m2 === m );      // false

console.log( m2.getState() ); // "start"
console.log( m2.getData() ); // { some: 'data' }

console.log( m.getState() ); // "start"
console.log( m.getData() ); // null
```


### Restricting transitions

By default we can transition from any state to any other state.

But sometimes we want to restrict state-to-state transitions according to 
pre-configured rules. We can specify such rules using `from` and `to` arrays:

```javascript
var Machine = require('immutable-state-machine');

var m = new Machine([
  {
    id: 'step1',
    from: [],
    to: ['step2'],
  },
  {
    id: 'step2',
    from: ['step1'],
    to: ['step3'],
  },
  {
    id: 'step3',
    from: ['step2'],
    to: ['step4'],
  },
  {
    id: 'step4',
    from: ['step3'],
    to: ['step1'],
  },
])

console.log( m.getState() );    // "step1"

// m.goto('step3');  -> Error
// m.goto('step4');  -> Error

m.goto('step2');

// m.goto('step1');  -> Error
// m.goto('step4');  -> Error

m.goto('step3');

// m.goto('step1');  -> Error
// m.goto('step2');  -> Error

m.goto('step4');

// m.goto('step1');  -> Error, because step1 "from" is empty array
// m.goto('step2');  -> Error
// m.goto('step3');  -> Error
```

The above machine allows us transition from `step1` through to `step4` and 
then nothing else. Note that although we have specified that `step4` may 
transition _to_ `step1`, we specified an empty _from_ array for `step1 thus 
specifying that it is not possible to transition to `step1` from another step.


## Building

To build the code and run the tests:

    $ npm install -g gulp
    $ npm install
    $ npm run build


## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/hiddentao/immutable-state-machine/blob/master/CONTRIBUTING.md).

## License

MIT - see [LICENSE.md](https://github.com/hiddentao/immutable-state-machine/blob/master/LICENSE.md)

