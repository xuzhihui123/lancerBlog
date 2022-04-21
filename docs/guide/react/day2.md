## 1、index.js

 * **函数式组件**

   - 自定义组件的名称必须是首字母大写 原生组件小写开头，自定义大写字母

   - 组件必须使用前定义

   - 组件需要返回并且只能返回一个根元素

```js
import React from 'react';
import ReactDOM from './source/react-dom'; // 手写的

/**
 * 函数式组件
 * 1、自定义组件的名称必须是首字母大写 原生组件小写开头，自定义大写字母
 * 2、组件必须使用前定义
 * 3、组件需要返回并且只能返回一个根元素
 */

function Welcome(props){
  return <div>
      <span>{props.name}</span>
      {props.children}
  </div>
}


let a = <Welcome/>
console.log(a);   // 此时的vnode的type就是个函数

ReactDOM.render(<Welcome name={'hello lancer'}>
    <h3>good</h3>
</Welcome>,document.getElementById('app'))

```
这就是上方Welcome组件的虚拟dom，可以看到type就是个函数。

![函数组件虚拟dom](/lancerBlog/react/pn1.png)

## 2、createElement.js

初步手写成这样生成虚拟dom树，此时的children可能是数组也可能是基本类型

```js
  
  function createElement(type,config,children){
    if(config){
      delete config.__source
      delete config.__self
    }
    
    let props = {...config}
  
    if(arguments.length > 3){
      children = Array.prototype.slice.call(arguments,2)
    }
    props.children = children
  
    return {
      type,
      props
    }
  }
  
  
  const React = {
    createElement
  }
  
  export default React
```

  ## 3、react-dom.js

初步写成这样，后续还会更新，render其实就是将虚拟dom转换为真实dom。**updateProps**为更新dom上的属性。

此时在**createDOM**函数中会判断是否是函数式组件，然后调用**mountFunctionComponent**方法，该方法调用该函数生成虚拟dom继续创建真实dom

  ```js
  
  function render(vdom,container){
    const dom = createDOM(vdom)
    container.appendChild(dom)
  }
  
  
  function createDOM(vdom){
    if(typeof vdom === 'string' || typeof vdom==='number'){
      return document.createTextNode(vdom)
    }
    let {type,props} = vdom
    let dom
    // 渲染函数式组件
    if(typeof type === 'function'){
      return mountFunctionComponent(vdom)
    }else{
     dom = document.createElement(type)
    }
    updateProps(dom,props)
    if(typeof props.children === 'string' || typeof props.children === 'number'){
      dom.textContent = props.children
      // 儿子是数组
    }else if(Array.isArray(props.children)){
        reconcileChildren(props.children,dom)
      // 如果只有一个儿子
    }else if(typeof props.children === 'object' && props.children.type){
      render(props.children,dom)
    }
    return dom
  }
  
  
  /**
   * 
   * @param {*} vdom  类型为自定义函数组件的虚拟dom
   */
  function mountFunctionComponent(vdom){
    let {type:FunctionComponent,props} = vdom
    let renderVdom = FunctionComponent(props)
    return createDOM(renderVdom)
  }
  
  
  /**
   * 
   * @param {*} childrenVdom  儿子虚拟dom数组
   * @param {*} parentDom  父亲dom
   */
  function reconcileChildren(childrenVdom,parentDom){
    for(let i=0;i<childrenVdom.length;i++){
      render(childrenVdom[i],parentDom)
    }
  }
  
  /**
   * 
   * @param {*} dom  真实dom
   * @param {*} newProps  新属性
   */
  function updateProps(dom,newProps){
    for (const key in newProps) {
      if(key === 'children') continue;
      if(key === 'style'){
        let styleObj = newProps[key]
        for(let attr in styleObj){
          dom.style[attr] = styleObj[attr]
        }
      }else{
        dom[key] = newProps[key]
      }
    }
  }
  
  
  const ReactDOM = {
    render
  }
  
  
  
  export default ReactDOM
  ```

