- getDerivedStateFromProps是一个静态方法，第一个参数为props，第二个参数为state

- getDerivedStateFromProps 在初始化的时候会调用一次，返回新的state和当前state合并

  ```js
  /**
   * 
   * @param {*} vdom  类型为自定义类组件的虚拟dom
   */
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

- getDerivedStateFromProps在更新的时候会调用返回新的state

  ```js
  // 判断组件是否需要更新
  function shouldUpdate (classInstance, nextProps, nextState) {
    // 若果实例上有shouldComponentUpdate 方法，并且返回false,表示不更新
    let willUpdate = true
    // getDerivedStateFromProps 生命周期
    if (classInstance.ownVdom.type.getDerivedStateFromProps) {
      // 传入下一个props 和 还未更新的state
      let partialState = classInstance.ownVdom.type.getDerivedStateFromProps(nextProps, nextState)
      if (partialState) {
        nextState = { ...nextState, ...partialState }
      }
    }
    if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
      willUpdate = false
    }
    if (willUpdate && classInstance.componentWillUpdate) {
      classInstance.componentWillUpdate() // 生命周期componentWillUpdate
    }
    if (nextProps) {
      classInstance.props = nextProps
    }
  
    classInstance.state = nextState  // 更新最新状态
  
    willUpdate && classInstance.updateComponent() // willUpdate 为true更新
  }
  ```

- getDerivedStateFromProps在调用类组件的forceUpdate方法会调用，返回新的state

  ```js
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
  ```

  

## 7.1 例子代码

```js
import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'




class Counter extends React.Component {
  static defaultProps = {
    name: 'static lancer'
  }
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
    console.log('Count 1 start');
  }
  handlerClick = () => {
    this.setState({ number: this.state.number + 1 }, () => {
      console.log('callback execute');
    })
  }
  componentWillMount () {
    console.log('Count 2 start');
  }
  componentDidMount () {
    console.log('Count 4 start');
  }
  shouldComponentUpdate (nextProps, nextState) {
    console.log('shoud', this.state, nextState);
    return true
  }
  componentWillUpdate () {
    console.log('willUpdate', this.state);

    console.log('Count 5 start');

  }
  componentDidUpdate () {
    console.log('didUpdate', this.state);

    console.log('Count 6 start');
  }
  render () {
    console.log('Count 3 start');
    return (
      <div>
        <p>{Counter.defaultProps.name}</p>
        <p>{this.state.number}</p>
        {<ChildCount count={this.state.number} />}
        <button onClick={this.handlerClick}>+1</button>
      </div>
    )
  }
}


class ChildCount extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
  }
  // UNSAFE_componentWillUpdate(){  // 如果这边写了 getDerivedStateFromProps，UNSAFE_componentWillUpdate,
  // UNSAFE_componentWillMount生命周期无效，报错，避免使用
  //   console.log('child will update');
  // }
  static getDerivedStateFromProps (nextProps, prevState) {
    console.log(nextProps,prevState);
    console.log('child stateFromProps');
    const { count } = nextProps
    if (count === 0) {
      return { number: 10 }
    } else if (count % 2 === 0) {
      return { number: count * 2 }
    }
    return null // 不改变当前state状态
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log(nextProps,nextState);
    return true
  }
  childClick=()=>{
    this.setState({
      number:this.state.number+1
    })
  }
  render () {
    return (
      <div>
        child
        {this.state.number}
        <h3 onClick={this.childClick}>child click</h3>
      </div>
      
    )
  }
}





ReactDOM.render(<Counter />, document.getElementById('app'))

```

