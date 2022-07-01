export class MapSet extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
}

export class WeakMapSet extends WeakMap {
  set(key, value) {
    super.set(key, value);
    return value;
  }
}
