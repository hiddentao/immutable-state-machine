(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  // CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory();
  }
  // Browser
  else {
    let _ism = factory();

    let existing = root.ImmutableStateMachine;

    _ism.noConflict = function() {
      root.ImmutableStateMachine = existing;
      
      return _ism;
    };

    root.ImmutableStateMachine = _ism;
  }
}(this, function() {

  const _arrayToObj = function(arr) {
    let ret = {};

    arr.forEach(function(val) {
      ret[val] = val;
    });

    return ret;
  };


  const DEFAULT_DATA = null;


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
  var ImmutableStateMachine = function(states) {
    this._setupStates(states);
  }


  /**
   * Get id of active state.
   * @return {String}
   */
  ImmutableStateMachine.prototype.getState = function() {
    return this._activeState;
  };


  /**
   * Get extra data associated with current state.
   * @return {Object}
   */
  ImmutableStateMachine.prototype.getData = function() {
    return this._states[this._activeState].data;
  };



  /**
   * Goto a state.
   *
   * This will return a new instance of the state machine if necessary. Note 
   * that if the the new state is the same as the current one but the `data` 
   * has changed then a new instance will be returned.
   * 
   * @param  {String} newStateId id of state to move to.
   * @param  {Object} [data] Extra data to associate with new state.
   * @return {ImmutableStateMachine}
   */
  ImmutableStateMachine.prototype.goto = function(newStateId, data = DEFAULT_DATA) {
    if (newStateId === this._activeState) {
      if (this._states[this._activeState].data !== data) {
        return this._new(newStateId, data);
      } else {
        return this;
      }
    } else {
      // check that new state is valid
      if (!this._states[newStateId]) {
        throw new Error(`Invalid state: ${newStateId}`);
      }

      let activeConfig = this._states[this._activeState],
        newConfig = this._states[newStateId];

      // check that transition is permissible
      if ( (activeConfig.to && !activeConfig.to[newStateId]) 
            || (newConfig.from && !newConfig.from[this._activeState]) 
          ) {
        throw new Error(`Disallowed transition: ${this._activeState} -> ${newStateId}`);
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
  ImmutableStateMachine.prototype._setupStates = function(states) {
    if (!(states instanceof Array) || 2 > states.length) {
      throw new Error('Atleast 2 states required');
    }

    this._states = {};

    states.forEach((state) => {
      let stateId = state.id || state;

      if (this._states[stateId]) {
        throw new Error(`State already defined: ${stateId}`);
      }

      this._states[stateId] = {
        data: DEFAULT_DATA,
      };

      if (state.from) {
        this._states[stateId].from = _arrayToObj(state.from);
      }

      if (state.to) {
        this._states[stateId].to = _arrayToObj(state.to);
      }

      // set initial state
      if (!this._activeState || state.initial) {
        this._activeState = stateId;
      }
    }); 
  } 


  /** 
   * Return cloned instance with new state and data set.
   * @param  {String} newStateId id of state to move to.
   * @param  {Object} [data] Extra data to associate with new state.
   * @return {ImmutableStateMachine}
   */
  ImmutableStateMachine.prototype._new = function(stateId, data) {
    let inst = Object.create(ImmutableStateMachine.prototype);

    inst._states = JSON.parse(JSON.stringify(this._states));
    inst._activeState = stateId;
    inst._states[inst._activeState].data = data;

    return inst;
  }

  return ImmutableStateMachine;
}));
