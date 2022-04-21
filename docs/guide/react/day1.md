## 2.1、index.js

- 像**element**变量底层经过babel转译成React.createElement()函数，React.createElement()函数执行生成虚拟dom 。这边需要导入React库也是为了使用*React.createElement*函数。

- **ReactDOM.render**就是将虚拟dom转换为真实dom

```js
import React from './source/createElement.js';
import ReactDOM from './source/react-dom';

// jsx编译成React.createElement是在webpack中执行的
let element = <h1 className={'aaa'} style={{color:'red'}}>hello world</h1>
// React.createElement("h1", null, "hello world");
// element就是vnode
console.log(element);
console.log(JSON.stringify(element,null,2));

//不可变 也不可增加属性
// element.type = "div"

// 将虚拟dom转换真实dom
ReactDOM.render(element,document.getElementById('app'))

```
## 2.2、createElement.js

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
  ## 2.3、react-dom.js

初步写成这样，后续还会更新，render其实就是将虚拟dom转换为真实dom。updateProps为更新dom上的属性

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
    let dom =  document.createElement(type)
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

