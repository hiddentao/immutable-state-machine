'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _arrayToObj = function _arrayToObj(arr) {
  var ret = {};

  arr.forEach(function (val) {
    ret[val] = val;
  });

  return ret;
};

/**
 * Construct a state machine.
 *
 * The `stateConfig` array in its simplest form must have atleast two 
 * states, e.g:
 *
 * ```
 * ['start', 'stop']
 * ```
 *
 * You can restrict state transitions using `to` and `from` keys:
 *
 * ```
 * [
 *   {
 *     id: 'step1',
 *     from: [],    // cannot 
 *     to: ['step2'],
 *   },
 *   {
 *     id: 'step2',
 *     from: ['step1'],
 *     to: ['step3'],
 *   },
 *   {
 *     id: 'step3',
 *     from: ['step2'],
 *     to: ['step4'],
 *   },
 *   {
 *     id: 'step4',
 *     from: ['step3'],
 *     to: ['step1'],
 *   },
 * ]
 *
 * By default the first state in the passed-in array is set as the initial 
 * state, unless explicitly specified otherwise:
 * 
 * [
 *   'step1',
 *   {
 *     id: 'step2',
 *     initial: true,   // step2 will thus be the initial state
 *   },
 * ],
 *
 * @param {Array} stateConfig list of states and associated configuration.
 */

var ImmutableStateMachine = function () {
  function ImmutableStateMachine() {
    _classCallCheck(this, ImmutableStateMachine);
  }

  _createClass(ImmutableStateMachine, [{
    key: 'contructor',
    value: function contructor(states) {
      console.log(234324234234);
      this._setupStates(states);
    }

    /**
     * Get id of active state.
     * @return {String}
     */

  }, {
    key: 'change',


    /**
     * Change state.
     *
     * This will return a new instance of the state machine if necessary. Note 
     * that if the the new state is the same as the current one but the `data` 
     * has changed then a new instance will be returned.
     * 
     * @param  {String} newStateId id of state to move to.
     * @param  {Object} [data] Extra data to associate with new state.
     * @return {ImmutableStateMachine}
     */
    value: function change(newStateId) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (newStateId === this._activeState) {
        if (this._states[this._activeState].data !== data) {
          return this._new(newStateId, data);
        } else {
          return this;
        }
      } else {
        // check that new state is valid
        if (!this._states[newStateId]) {
          throw new Error('Invalid state: ' + newStateId);
        }

        var activeConfig = this._states[this._activeState],
            newConfig = this._states[newStateId];

        // check that transition is permissible
        if (activeConfig.to && !activeConfig[newStateId] || newConfig.from && !newConfig[this._activeState]) {
          throw new Error('Cannot change state from ' + this._activeState + ' to ' + newStateId);
        }

        // do it!
        return this._new(newStateId, data);
      }
    }

    /**
     * Setup state configuration.
     * 
     * @param  {Array} states State configuration.
     */

  }, {
    key: '_setupStates',
    value: function _setupStates(states) {
      var _this = this;

      if (!states || !states.length || 2 > states.length) {
        throw new Error('Atleast 2 states required');
      }

      this._states = {};

      states.forEach(function (state) {
        var stateId = state.id || state;

        if (_this._states[stateId]) {
          throw new Error('State already defined: ' + state);
        }

        _this._states[stateId] = {};

        if (state.from) {
          _this._states[stateId] = _arrayToObj(state.from);
        }

        if (state.to) {
          _this._states[stateId] = _arrayToObj(state.to);
        }

        // set initial state
        if (!_this._activeState || state.initial) {
          _this._activeState = stateId;
        }
      });
    }

    /** 
     * Return cloned instance with new state and data set.
     * @param  {String} newStateId id of state to move to.
     * @param  {Object} [data] Extra data to associate with new state.
     * @return {ImmutableStateMachine}
     */

  }, {
    key: '_new',
    value: function _new(stateId, data) {
      var inst = Object.create(ImmutableStateMachine.prototype);

      inst._states = this._states;
      inst._activeState = stateId;
      inst._states[stateId].data = data;

      return inst;
    }
  }, {
    key: 'state',
    get: function get() {
      return this._activeState;
    }

    /**
     * Get extra data associated with current state.
     * @return {Object}
     */

  }, {
    key: 'data',
    get: function get() {
      return this._states[this._activeState].data;
    }
  }]);

  return ImmutableStateMachine;
}();

// // AMD
// if (typeof define === 'function' && define.amd) {
//   define([], ImmutableStateMachine);
// }
// // CommonJS
// else if (typeof exports === 'object') {

module.exports = ImmutableStateMachine;
// }
// // Browser
// else if (typeof window === 'object') {
//   let existing = window.ImmutableStateMachine;

//   ImmutableStateMachine.noConflict = function() {
//     window.ImmutableStateMachine = ImmutableStateMachine;

//     return ImmutableStateMachine;
//   };

//   window.ImmutableStateMachine = ImmutableStateMachine;
// }