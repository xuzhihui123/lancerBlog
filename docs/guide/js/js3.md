## cloneDeep

简写对象深拷贝，使用WeakMap可以缓存对象，自动垃圾回收

```js
function cloneDeep(obj,patch=new WeakMap()){
  if(obj === null || obj===undefined){
    return obj
  }
  if(obj instanceof Date){
    return new Date(obj)
  }
  if(obj instanceof RegExp){
    return new RegExp(obj)
  }
  // ....
  if(patch.get(obj)) return patch.get(obj)
  let ret = new obj.constructor
  patch.set(obj,ret)
  if(typeof obj === 'object'){
    for(let key in obj){
       ret[key] = cloneDeep(obj[key],patch)
    }
  }else{
    return obj
  }
  return ret
}
```

WeakMap达到一个缓存对象的作用， 这是为了防止出现以下循环对象的问题，防止栈溢出

```js
// 循环调用自己 
let obj = {}
obj.a = {}
obj.a.b = obj.a
```

## Compose

compose也叫做函数复合

- 来看个例子

  ```js
  function sum(a,b){
    return a+b
  }
  
   function len(c){
     return c.length
   }
  
  
   function prefix(a){
     return `${a}&`
   }
  
  let res =  prefix(len(sum('a','b')))
  console.log(res); // 2&
  ```

可以看到sum的返回值传给了len，然后又传给了prefix，这样函数的返回值传给下一个函数我们叫做函数复合

- 使用reduceRight实现compose

  ```js
   function compose(...fns){
      return (...args)=>{
      let lastFn = fns.pop()
      let res = lastFn(...args)
        return fns.reduceRight((pre,cur)=>{
          return cur(pre)
        },res)
      }
   }
  
  
   let final = compose(prefix,len,sum)
   let res = final('a','b')
   console.log(res);
  ```

- 使用reduce实现compose

  其实可以看出调用compose最终还是返回一个函数

  我们可以拆分一下

  第一次：(...args)=>{return prefix( len (...args) ) }

  第二次最终返回：(...args) => { return ( (...args)=>{return prefix( len (...args) ) } ) (sum (...args) )}

  可以理解为 let final = (...args) => { return ( (...args)=>{return prefix( len (...args) ) } ) (sum (...args) )}

  ```js
  function compose(...fns){
    return fns.reduce((pre,cur)=>{
      return (...args)=>{
        return pre(cur(...args))
      }
    })
  }
  
  
   let final = compose(prefix,len,sum)
   let res = final('a','b')
   console.log(res);
  ```

- 简写reduce

  ```js
  // 简写
  let compose = (...fns)=> fns.reduce((pre,cur)=>(...args)=>pre(cur(...args)))
  
   let final = compose(prefix,len,sum)
   let res = final('a','b')
   console.log(res);
  
  ```

## Curring

函数柯里化就是一个函数，其参数传入一个函数，并且返回一个函数，返回的函数参数传入总数等于传入的函数的参数总数，那么调用传入的函数

- 实现

  ```js
  function curring(fn,otherArgs = []){
    let originFnLength = fn.length
    return function(...args){
        let currentArgs = [...otherArgs,...args]
        if(currentArgs.length === originFnLength){
           return fn(...currentArgs)
        }else{
          return curring(fn,currentArgs)
        }
    }
  }
  
  
  function foo(a,b,c,d){
    return a+b+c+d
  }
  
  let final = curring(foo)
  
  
  let fn = final(1,2)(3,4)
  console.log(fn);
  ```

## reduce

简单实现reduce

```js
let a = [1,2,3,4]

// 实现reduce
Array.prototype.reduce = function(callback,pre){
  for(let i=0;i<this.length;i++){
    if(!pre){
      pre = callback(this[i],this[i+1],i+1,this)
      i++
    }else{
      pre = callback(pre,this[i],i,this)
    }
  }
  return pre
}


let ret = a.reduce((pre,cur,index,arr)=>{
  console.log(index);
   return pre+cur
})

console.log(ret);


```



