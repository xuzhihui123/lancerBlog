# WeakMap注意点

WeakMap特性：支持key是object，会自动垃圾回收

这边a设置null，weakMap就置空了 因为WeakMap会垃圾回收，但是Map是不会的

```js
class MyTest{

}


let a = new MyTest()

let weakMap = new WeakMap([[a,1]])

a = null  // 这边a设置null，weakMap就置空了 因为WeakMap会垃圾回收，但是Map是不会的

```



