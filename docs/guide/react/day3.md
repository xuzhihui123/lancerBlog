## 1、index.js

 * 类组件
 * 可以在构造函数里，并且只能在构造函数中给this.state赋值
 * 属性对象props是父组件给的，不能改变。只读属性。

```js
import React from './source/createElement';
import ReactDOM from './source/react-dom';


/**
 * 类组件
 * 可以在构造函数里，并且只能在构造函数中给this.state赋值
 * 属性对象props是父组件给的，不能改变。只读属性。
 */

class Counter extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      number:0
    }
  }
  handlerClick=()=>{
    this.setState({
      number:this.state.number+1
    })
  }
  render(){
    return (
      <div>
        <button onClick={this.handlerClick}>修改状态</button>
        <br/>
         {this.state.number}
         <br/>
         {'我是'+this.props.name}
      </div>
    )
  }
}





ReactDOM.render(<Counter name={'lancer'}/>,document.getElementById('app'))

```
## 2、createElement.js

这边需要导入Component类方便类组件继承

```js
  
import Component from './Component'

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
  createElement,
  Component
}

export default React
```
  ## 3、react-dom.js

在创建真实dom的时候根据createDOM方法判断type.isReactComponent是否为类组件，如果是类组件，调用mountClassComponent方法，并且创建类组件实例，传入props，调用实例的render方法返回虚拟dom，在递归调用createDOM生成真实dom，实例上记录真实dom属性方便后期更新组件classInstance.dom = dom

在createDOM方法中，更新属性中，判断是否有key.startsWith('on')事件，给真实dom绑定事件

  ```js
  
  
  function render(vdom,container){
    const dom = createDOM(vdom)
    container.appendChild(dom)
  }
  
  
  export function createDOM(vdom){
    if(typeof vdom === 'string' || typeof vdom==='number'){
      return document.createTextNode(vdom)
    }
    let {type,props} = vdom
    let dom
    if(typeof type === 'function'){
      //  说明是个类组件
      if(type.isReactComponent){
        return mountClassComponent(vdom)
      }
      // 函数式组件
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
   * @param {*} vdom  类型为自定义类组件的虚拟dom
   */
  function mountClassComponent(vdom) {
    // 解构类的定义和类的属性对象
    let {type,props} = vdom
    // 创建类的实例
    let classInstance = new type(props)
    // 调用类的实例render方法返回要渲染的虚拟dom
    let renderDom = classInstance.render()
    // 根据虚拟dom对象创建真实dom对象
    let dom = createDOM(renderDom)
    // 为了以后类组件的更新，把真实dom挂载到了类的实例上
    classInstance.dom  = dom
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
      }else if(key.startsWith('on')){
        // 给真实dom加属性 onclick。。。
        dom[key.toLocaleLowerCase()] = newProps[key]
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

## 4、Component.js

index.js中调用setState方法，更新state状态，此时需要重新调用render方法生成新的虚拟dom，然后调用updateClassComponent更新组件（此时还没有做diff，后续会完善代码）

**isReactComponent**标识是否是类组件

```js
import {createDOM} from './react-dom'
class Component{ 
   static isReactComponent = true
  constructor(props){
    this.props = props
    this.state = {}
  }
  setState(partialState){
    let state = this.state
    this.state = {...state,...partialState}
    let newVdom = this.render()
    // 状态改变更新类组件
    updateClassComponent(this,newVdom)
  }
  render(){
    throw new Error('此方法是抽象方法，需要子类实现')
  }
}


function updateClassComponent(classInstance,newVdom){
  // 拿到之前创建实例记录的dom
  let oldDOM = classInstance.dom
  // 创建新的真实dom
  let newDOM  = createDOM(newVdom)
  // 替换新的真实dom
  oldDOM.parentNode.replaceChild(newDOM,oldDOM)
  // 继续再实例上记录新的dom
  classInstance.dom = newDOM
}


export default Component
```

