## 8.1 createRef原理

其实就是返回一个对象，对象的属性为current

```js
function createRef(){
  return {
    current:null
  }
}
```

在创建真实dom的时候把current指向当前dom

```js
export function createDOM (vdom) {
  if (vdom === null) {
    return document.createTextNode('')
  }
  let { type, props, ref } = vdom
  let dom
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content)
  } else if (typeof type === 'function') {
    //  说明是个类组件
    if (type.isReactComponent) {
      return mountClassComponent(vdom)
    }
    // 函数式组件
    return mountFunctionComponent(vdom)
  } else {
    dom = document.createElement(type)
  }
  type !== REACT_TEXT && updateProps(dom, {}, props)
  if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom)
    // 如果只有一个儿子
  } else if (typeof props.children === 'object' && props.children.type) {
    mount(props.children, dom)
  }
  vdom.dom = dom
  if (ref) {
    ref.current = dom  // 赋值ref.current为真实dom
  }
  return dom
}
```

## 8.2 getSnapshotBeforeUpdate生命周期

该生命周期在组件更新之前调用，并且它的返回值将作为 componentDidUpdate生命周期的第三个参数传入

```js

class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this) // 创建实例都会创建一个updater实例，也就是更新器
  }
  setState (partialState, callback) {
    this.updater.addState(partialState, callback)
  }
  render () {
    throw new Error('此方法是抽象方法，需要子类实现')
  }
  forceUpdate(){
    if (this.ownVdom.type.getDerivedStateFromProps) {
      // 传入下一个props 和 还未更新的state
      let partialState = this.ownVdom.type.getDerivedStateFromProps(this.props, this.state)
      if (partialState) {
        this.state = { ...this.state, ...partialState }
      }
    }
    this.updateComponent()
  }
  updateComponent () {

    let newRenderVDOM = this.render()
    
    // getSnapshotBeforeUpdate 生命周期
    let extraArgs = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate()

    // 深度比较两个vdom
    compareTwoVDOM(this.dom.parentNode, this.oldRenderVDOM, newRenderVDOM)
    this.oldRenderVDOM = newRenderVDOM

    // updateClassComponent(this,newRenderVDOM)
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props,this.state,extraArgs)  // 生命周期componentDidUpdate
    }
  }
}
```

## 8.3 例子代码

```js
import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'

class Count extends React.Component{
   ref = React.createRef()
   state = {
      list:[]
   }
   getSnapshotBeforeUpdate(prevProps,prevState){
     return this.ref.current.scrollHeight
   }
   componentDidUpdate(prevProps,prevState,snapshot){
    let diff = this.ref.current.scrollHeight - snapshot
    console.log('增加了'+diff + 'px');
   }
   countClick=()=>{
     let listLength = this.state.list.length
     this.state.list.push(listLength)
     this.setState({
       list:this.state.list
     })
   }
   render(){
     return <div>
        <button onClick={this.countClick}>+1</button>
        <ul ref={this.ref}>
           {
             this.state.list.map((item,index)=>{
               return <li key={index}>{index}</li>
             })
           }
        </ul>
     </div>
   }
}





ReactDOM.render(<Count />, document.getElementById('app'))

```

