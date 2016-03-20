/* jshint globalstrict: true */
'use strict';

function initValue() {}

function Scope() {
  this.$$watchers = [];
}

Scope.prototype.$watch = function( watchFn, listenerFn ) {
  var watcher = {
    watchFn   : watchFn,
    listenerFn: listenerFn || function() {},
    last      : initValue
  };

  this.$$watchers.push(watcher);
};

Scope.prototype.$$digestOnce = function () {
  var self = this;
  var newValue, oldValue, dirty;
  _.forEach( this.$$watchers, function(watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;

    if ( oldValue !== newValue ) {
      watcher.last = newValue;
      watcher.listenerFn( newValue, oldValue === initValue ? newValue : oldValue, self );
      dirty = true;
    }
  } );
  return dirty;
};

Scope.prototype.$digest = function () {
  var dirty;
  do {
    dirty = this.$$digestOnce();
  } while (dirty);
};
