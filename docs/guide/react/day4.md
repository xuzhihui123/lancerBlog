##  5.1、setState用法

 * 合成事件和批量更新
 * 在react中，事件的更新是异步的，是批量的，不是同步的
 * 调用state之后状态并没有立即更新，而是先缓存起来了
 * 等事件函数处理完成后，在进行批量更新，一次更新并重新缓存
 * 因为jsx事件处理函数是react控制的，只要归react控制就是批量，不归react管，放在宏任务、微任务，就是非批量
 * 以下代码打印输出 0 0 2 3

```js
import React from 'react';
import ReactDOM from 'react-dom';


class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  handlerClick = () => {
    this.setState({
      number: this.state.number + 1
    })
    console.log(this.state.number);   // 0
    this.setState({   // 这边加上门setState有两个只会执行1次
      number: this.state.number + 1
    })
    console.log(this.state.number);  // 0
    setTimeout(() => {
      this.setState({
        number: this.state.number + 1
      })
      console.log(this.state.number); // 2
      this.setState({
        number: this.state.number + 1
      })
      console.log(this.state.number); // 3
    }, 1000);
  }
  render () {
    return (
      <div>
        <button onClick={this.handlerClick}>修改状态</button>
        <br />
        {this.state.number}
        <br />
        {'我是' + this.props.name}
      </div>
    )
  }
}





ReactDOM.render(<Counter name={'lancer'} />, document.getElementById('app'))
```

- 如果setState里面传入函数，那么state就会记录上次的值，此时打印0 0 3 4

```js
  handlerClick = () => {
    this.setState((lastState)=>({number:lastState.number+1}))
    console.log(this.state.number);   // 0
    this.setState((lastState)=>({number:lastState.number+1}))
    console.log(this.state.number);  // 0
    setTimeout(() => {
      this.setState((lastState)=>({number:lastState.number+1}))
      console.log(this.state.number); // 3
      this.setState((lastState)=>({number:lastState.number+1}))
      console.log(this.state.number); // 4
    }, 1000);
  }
```

- 如果setState里面传入第二个参数，为callback回调，那么此时打印0 0 2 2 3 3 4 4

```js
  handlerClick = () => {
    this.setState((lastState)=>({number:lastState.number+1}),()=>{
      console.log(this.state.number);   // 2
    })
    console.log(this.state.number);   // 0
    this.setState((lastState)=>({number:lastState.number+1}),()=>{
      console.log(this.state.number);   // 2
    })
    console.log(this.state.number);  // 0
    setTimeout(() => {
      this.setState((lastState)=>({number:lastState.number+1}),()=>{
        console.log(this.state.number);   // 3
      })
      console.log(this.state.number); // 3
      this.setState((lastState)=>({number:lastState.number+1}),()=>{
        console.log(this.state.number);   // 4
      })
      console.log(this.state.number); // 4
    }, 1000);
  }
```

## 5.2、原理

首先在创建组件Counter实例的时候会继承Component类，**Component**类里面会实现一个**Updater**更新器（在Component.js中），

然后在组件调用setState方法的时候会调用当前updater更新器实例上的**addState**方法，把**状态**和**回调**保存在更新器中，然后根据**updateQueue.isBatchingUpdate** 判断是否批量更新。（组件在创建真实dom的**updateProps**也就是更新属性的方法中绑定事件，

并且对事件做了合成，也就是包了一层，调用**addEvent**方法，绑定事件的同时先设置**updateQueue.isBatchingUpdate**为批量更新，当事件执行完后，此时的state和回调也都保存在当前**updater**更新器实例中，在调用**updateQueue.batchUpdater**方法批量更新）

### 5.2.1、index.js

```js
import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }
  handlerClick = () => {
      this.setState({
        number: this.state.number + 1
      },function(){
        console.log('cb1',this.state.number);
      })
      console.log(this.state.number);   // 0
      this.setState({
        number: this.state.number + 1
      },()=>{
        console.log('cb2',this.state.number);
      })
      console.log(this.state.number);  // 0
  }
  render () {
    return (
      <div>
        <button onClick={this.handlerClick}>
          <span>修改状态</span>
        </button>
        <br />
        {this.state.number}
        <br />
        {'我是' + this.props.name}
      </div>
    )
  }
}





ReactDOM.render(<Counter name={'lancer'} />, document.getElementById('app'))
```

### 5.2.2、createElement.js

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

### 5.2.3、react-dom.js

```js
import { addEvent } from "./event"


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
      // dom[key.toLocaleLowerCase()] = newProps[key]
      addEvent(dom,key.toLocaleLowerCase(),newProps[key])
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

### 5.2.4、Component.js

```js
import {createDOM} from './react-dom'

export let updateQueue = {
  isBatchingUpdate:false, // 当前是否处理批量更新，默认值是false
  updaters:new Set(),
  batchUpdater(){
    [...this.updaters].map(updater=>updater.updateClassComponent())
    this.updaters.clear()
    this.isBatchingUpdate = false
  }
}

class Updater{
  constructor(classInstance){
    this.classInstance = classInstance  // 类组件实例
    this.pendingStatus = []  // 等待生效的状态，可能是一个对象，也可能是一个函数
    this.cbs = [] // 回调
  }
  addState(partialState,callback){
    this.pendingStatus.push(partialState)
    typeof callback === 'function' && this.cbs.push(callback) // 状态更新后的回调
    if(updateQueue.isBatchingUpdate){  // 如果当前是批量更新，先缓存updater
      updateQueue.updaters.add(this)
    }else{
      this.updateClassComponent()
    }
  }
  updateClassComponent(){
    let {classInstance,pendingStatus,cbs} = this
    if(pendingStatus.length>0){ // 如果有等待更新的状态对象的话
      classInstance.state = this.getState() // 计算新状态
      classInstance.forceUpdate()  // 更新vDOM
      cbs.forEach(cb=>cb.call(classInstance)) // 执行回调
      cbs.length = 0 // 清空回调
    }
  }
  getState(){
    let {classInstance,pendingStatus} = this
    let {state} = classInstance
    pendingStatus.forEach((nextState)=>{
      if(typeof nextState === 'function'){
        nextState = nextState.call(classInstance,state)
      }
       state = {...state,...nextState}
    })
    pendingStatus.length = 0 // 清空数组
    return state
  }
}



class Component{ 
   static isReactComponent = true
  constructor(props){
    this.props = props
    this.state = {}
    this.updater = new Updater(this) // 创建实例都会创建一个updater实例，也就是更新器
  }
  setState(partialState,callback){
    this.updater.addState(partialState,callback)
  }
  render(){
    throw new Error('此方法是抽象方法，需要子类实现')
  }
  forceUpdate(){
    let newVDOM = this.render()
    updateClassComponent(this,newVDOM)
  }
}


function updateClassComponent(classInstance,newVdom){
  let oldDOM = classInstance.dom
  let newDOM  = createDOM(newVdom)
  oldDOM.parentNode.replaceChild(newDOM,oldDOM)
  classInstance.dom = newDOM
}


export default Component


```

### 5.2.5、event.js

 * 给真实dom添加事件处理函数

   addEvent在document上添加事件委托，在调用事件之前**updateQueue.isBatchingUpdate = true** 设置批量更新，在事件添加完缓存之后  调用**updateQueue.batchUpdater**方法更新实例的updater

 * 为什么要这么做合成事件？为什么要做事件委托和事件代理

   1、做兼容处理，不同浏览器事件event是不一样

   2、可以在你写的事件处理函数之前之后做一些事情

```js
import {updateQueue} from './Component'



/**
 * @param {*} dom  事件dom
 * @param {*} eventType 监听类型
 * @param {*} listener  监听函数
 */
export function addEvent(dom,eventType,listener){
    let store = dom.store || (dom.store = {})
    store[eventType] = listener
    if(!document[eventType]){
      document[eventType] = dispatchEvent
    }
}

let syntheticEvent = {}  // 单例对象，保存每个事件的event 需要清空
function dispatchEvent(event){
  let {target,type} = event // target=事件源  type:click
  let eventType = `on${type}`
  updateQueue.isBatchingUpdate = true // 设置批量更新
  createSyntheticEvent(event) 
  while(target){  // 事件冒泡 防止当前点击的target是父亲的儿子 ，导致找不到store 无法执行listener
      let {store} = target
      let listener = store && store[eventType]
      listener && listener.call(target,syntheticEvent)
      target = target.parentNode
  }
  clearSyntheticEvent()
  updateQueue.batchUpdater()
}

function createSyntheticEvent(event){
  for(let key in event){
    syntheticEvent[key] =  event[key]
  }
}

function clearSyntheticEvent(){
  for(let key in syntheticEvent){
    delete syntheticEvent[key]
  }
}
```



