'use strict';
class MapSet extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
}
exports.MapSet = MapSet

class WeakMapSet extends WeakMap {
  set(key, value) {
    super.set(key, value);
    return value;
  }
}
exports.WeakMapSet = WeakMapSet
