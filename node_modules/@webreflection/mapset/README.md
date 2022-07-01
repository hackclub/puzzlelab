# mapset

[![Build Status](https://travis-ci.com/WebReflection/mapset.svg?branch=main)](https://travis-ci.com/WebReflection/mapset) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/mapset/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/mapset?branch=main)

`Map` and `WeakMap` that returns value on `.set(...)`.

```js
import {MapSet, WeakMapSet} from '@webreflection/mapset';

const map = new MapSet;

map.get('any') || map.set('any', 'value');
// "value"
```
