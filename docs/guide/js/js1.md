## 1-1、call的实现思路

1. 将函数作为要更改this绑定的对象的一个属性。也就是把函数作为call方法中第一个参数中的一个属性。
2. 通过 `对象 . 方法` 执行这个函数。
3. 返回当前函数执行后的结果。
4. 删除该对象上的属性。

```js
/**
 * @description: 实现call方法
 * @param : context this要绑定的值
 * @param : args 除第一个参数外的参数集合
 * @return: 函数返回值
 */
Function.prototype.myCall=function(context,...args) {
    let handler=Symbol();// 生成一个唯一的值，用来作为要绑定对象的属性key，储存当前调用call方法的函数
    if(typeof this!=='function') {
        //调用者不是函数

        throw this+'.myCall is not a function'
    }
    // 如果第一个参数为引用类型或者null
    if(typeof context==='object'||typeof context==='function') {
        // 如果为null 则this为window
        context=context||window;
    } else {
        // 如果为undefined 则this绑定为window
        if(typeof context==='undefined') {
            context=window;
        } else {
            // 基本类型包装  1 => Number{1}
            context=Object(context);
        }
    }

    // this 为当前调用call方法的函数。
    context[handler]=this;
    // 执行这个函数。这时这个函数内部this绑定为cxt，储存函数执行后的返回值。
    let result=context[handler](...args);
    // 删除对象上的函数
    delete context[handler];
    // 返回返回值
    return result;
}
```

## 1-2、apply的实现思路

由于apply跟call的唯一区别只是除了第一个参数外其余参数的传递形式不一样。在实现call的基础上略作修改就可以了。

apply参数的特点：

1. 除第一个参数外，其余参数必须为数组的形式。

2. 如果第二个参数存在

   2.1 如果第二个参数为null或者undefined，则无效。
   2.2 如果第二个参数类型不是Object，则抛出一个异常。如果不是数组，则无效。

   

```js
/**
 * @description: 实现apply方法
 * @param : context this要绑定的值
 * @param : argsArr 要传递给调用apply方法的函数的实参集合。数组形式。
 * @return: 函数返回值
 */
Function.prototype.myApply=function(context,argsArr) {
    let handler=Symbol();// 生成一个唯一的值，用来作为要绑定对象的属性key，储存当前调用call方法的函数
    if(typeof this!=='function') {
        //调用者不是函数

        throw this+'.myBind is not a function'
    }
    let args=[];
    // 如果传入的参数是不是数组，则无效
    if(typeof argsArr==='object'||typeof context==='function'||typeof argsArr==='undefined') {
        args=Array.isArray(argsArr)? argsArr:[];
    } else {
        // 如果为基本类型，如果是undefined，则无效，其它类型则抛出错误。
        throw 'TypeError: CreateListFromArrayLike called on non-object'
    }
    // 如果第一个参数为引用类型或者null
    if(typeof context==='object') {
        // 如果为null 则this为window
        context=context||window;
    } else {
        // 如果为undefined 则this绑定为window
        if(typeof context==='undefined') {
            context=window;
        } else {
            // 基本类型包装  1 => Number{1}
            context=Object(context);
        }
    }

    // this 为当前调用call方法的函数。
    context[handler]=this;
    // 执行这个函数。这时这个函数内部this绑定为cxt，储存函数执行后的返回值。
    let result=context[handler](...args);
    // 删除对象上的函数
    delete context[handler];
    // 返回返回值
    return result;
}
```

## 1-3 bind的实现

bind与call和apply区别还是很大的。
先看一个例子：

```js
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
    console.log(this.name+':'+age+'岁');
}

var bar=foo.bind(obj,'chen');
bar(18); // erdong:18岁


var b=new bar(27); // undefined:27岁
console.log(b.age); // 27
```

综合上述例子，我们总结一下bind方法特点：

1.调用bind方法会创建一个新函数,我们成它为绑定函数(boundF)。

2.当我们直接调用boundF函数时，内部this被绑定为bind方法的第一个参数。

3.当我们把这个boundF函数当做构造函数通过new关键词调用时，函数内部的this绑定为新创建的对象。(相当于bind提供的this值被忽略)。

4.调用bind方法时，除第一个参数外的其余参数，将作为boundF的预置参数，在调用boundF函数时默认填充进boundF函数实参列表中。

<!--bind方法中第一个参数的特点：

1. 当第一个参数(要更改的this绑定的对象)为null或者undefined时，this绑定为window(非严格模式)。
2. 当call方法中第一个参数为除null和undefined外的基本类型(String，Number，Boolean)时，先对该基本类型进行"装箱"操作。-->

我们根据上述的bind方法的特点，一步一步实现bind方法。

```js
// 第一步  返回一个函数
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;

    let boundF =  function() {
    }
    return boundF;
}

```

第一步我们实现了myBind方法返回一个函数。没错就是这就是利用了闭包。

```js
// 第二步 
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;

    let boundF=function() {
        thisFunc.call(context,...args);
    }
    return boundF;
}
```

第二步：当调用boundF方法时，原函数内部this绑定为bind方法的第一个参数，这里我们利用了call来实现。

```js
// 第三步
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    let boundF=function() {
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...args);
    }
    return boundF;
}
```

第三部：先判断boundF是否通过new调用，也就是判断boundF内部的this是否为boundF的一个实例。如果是通过new调用，boundF函数的内部this绑定为当前新创建的对象，因此调用call方法时把当前新创建的对象当做第一个参数传递。

```js
// 第四步
/**
 * @description: 实现bind方法
 * @param : context this要绑定的值
 * @param : args 调用bind方法时，除第一个参数外的参数集合，这些参数会被预置在绑定函数的参数列表中
 * @return: 返回一个函数
 */
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    let boundF=function() {
        let boundFAgrs=arguments;
        let totalAgrs=[...args,...arguments];
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    return boundF;
}
```

第四部：通过闭包的特性我们知道，boundF函数可以访问到外部的args变量，将它与boundF函数中的参数合并。然后当做调用原函数的参数。

到此我们简易版的bind已经显示完毕，下面测试：

```js
Function.prototype.myBind=function(context,...args) {
    // 这里的this为调用bind方法的函数。
    let thisFunc=this;
    let boundF=function() {
        let boundFAgrs=arguments;
        let totalAgrs=[...args,...arguments];
        let isUseNew=this instanceof boundF;
        thisFunc.call(isUseNew? this:context,...totalAgrs);
    }
    return boundF;
}
var obj={
    name: 'erdong'
}

function foo(name,age) {
    this.age=age;
    console.log(this.name+':'+age+'岁');
}

var bar=foo.myBind(obj,'chen');
bar(18); // erdong:18岁


var b=new bar(27); // undefined:27岁
console.log(b)
console.log(b.age); // 27

```

