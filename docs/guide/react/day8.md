## 9.1 React.createContext原理

- createContext是一个函数传入一个initialValue初始化value
- 返回Provider组件和Consumer组件

```js
function createContext(initialValue){
  let context = {
    Provider,
    Consumer
  }
  function Provider(props){
    if(!context._currentValue){
      context._currentValue = initialValue || {}
    }
   Object.assign(context._currentValue,props.value) // context._currentValue 饮用地址相同
    return props.children
  }

  function Consumer(props){
    return props.children(context._currentValue)
  }
  return context
}

```

- 类组件在初始化的时候判断是否有静态的contextType属性，有的话赋值当前类组件实例的context属性上

   if (type.contextType) {
      classInstance.context = type.contextType._currentValue
    }

  ```js
  function mountClassComponent (vdom) {
    // 解构类的定义和类的属性对象
    let { type, props,ref } = vdom
    // 创建类的实例
    let classInstance = new type(props)
    // 将实例上的ref 指向传来的ref属性
    ref && (classInstance.ref = ref)
    classInstance.ownVdom = vdom
    // 让这个类组件的vdom指向实例自己
    vdom.classInstance = classInstance
    // 生命周期componentWillMount
    if (classInstance.componentWillMount) {
      classInstance.componentWillMount()
    }
    // 生命周期getDerivedStateFromProps
    if (type.getDerivedStateFromProps) {
      let partialState = type.getDerivedStateFromProps(props, classInstance.state)
      if (partialState) {
        classInstance.state = { ...classInstance.state, ...partialState }
      }
    }
    // 赋值context 判断当前类是否有contextType静态属性
    if (type.contextType) {
      classInstance.context = type.contextType._currentValue
    }
    // 调用类的实例render方法返回要渲染的虚拟dom
    let renderDom = classInstance.render()
    // 存起来老的vdom
    classInstance.oldRenderVDOM = renderDom
    // 根据虚拟dom对象创建真实dom对象
    let dom = createDOM(renderDom)
    // 这边绑定componentDidMount到dom上 
    if (classInstance.componentDidMount) {
      classInstance.componentDidMount()
    }
    // 为了以后类组件的更新，把真实dom挂载到了类的实例上
    classInstance.dom = dom
    return dom
  }
  ```

- 函数式组件要拿到父亲传下来的context，使用Consumer


## 9.2 例子代码

```js
import React from './createElement';
import ReactDOM from './react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'


let PersonContext = React.createContext()
function getColor(color){
  return {border: `1px solid ${color}`,padding:'10px'}
}


class Person extends React.Component{
  state = {
    color:'red'
  }
  setColor=(color)=>{
    this.setState({
      color
    })
  }
  render(){
    let value = {color:this.state.color,setColor:this.setColor}
    return (
       <PersonContext.Provider value={value}>
          <div style={getColor(this.state.color)}>
            Person
            <Head/>
            <Body/>
          </div>
       </PersonContext.Provider>
    )
  }
}


class Head extends React.Component{
  static contextType = PersonContext
  render(){
    return (
      <div style={getColor(this.context.color)}>
         Head
      </div>
    )
  }
}

class Body extends React.Component{
  static contextType = PersonContext
  render(){
    return (
      <div style={getColor(this.context.color)}>
         Body
         <Tummy/>
         <button onClick={()=>{this.context.setColor('green')}}>
            变绿
         </button>
         <button onClick={()=>{this.context.setColor('red')}}>
            变红
         </button>
      </div>
    )
  }
}


function Tummy(props){
  return (
    <PersonContext.Consumer>
        {
          contextValue=>{
            return  (<div style={getColor(contextValue.color)}>
            tummy
         </div>)
          }
        }
    </PersonContext.Consumer>
  )
}




ReactDOM.render(<Person />, document.getElementById('app'))

```



  