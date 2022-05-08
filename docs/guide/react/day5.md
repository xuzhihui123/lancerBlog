## 6.1初识生命周期

- React 16之前的生命周期

![初始生命周期](/lancerBlog/react/5.png)

- 例子代码

  ```js
  import React from './createElement';
  import ReactDOM from './react-dom';
  // import React from 'react'
  // import ReactDOM  from 'react-dom'
  
  
  
  
  class Counter extends React.Component {
    static defaultProps = {
      name:'static lancer'
    }
    constructor(props) {
      super(props)
      this.state = {
        number: 0
      }
      console.log('Count 1 start');
    }
    handlerClick=()=>{
      this.setState({number:this.state.number+1},()=>{
        console.log('callback execute');
      })
    }
    componentWillMount(){  
      console.log('Count 2 start');
    }
    componentDidMount(){
      console.log('Count 4 start');
    }
    shouldComponentUpdate(nextProps,nextState){
      console.log('shoud',this.state,nextState);
      return nextState.number%2 === 0 ? true : false
    }
    componentWillUpdate(){
      console.log('willUpdate',this.state);
  
      console.log('Count 5 start');
  
    }
    componentDidUpdate(){
      console.log('didUpdate',this.state);
  
      console.log('Count 6 start');
    }
    render () {
      console.log('Count 3 start');
      return (
        <div>
          <p>{Counter.defaultProps.name}</p>
          <p>{this.state.number}</p>
         {this.state.number%4 === 0 ? <Child1/> : <Child />}
          <button onClick={this.handlerClick}>+1</button>
        </div>
      )
    }
  }
  
  
  class Child extends React.Component{
    componentWillReceiveProps(){
      console.log('child receive');
    }
    shouldComponentUpdate(){
      console.log('child shouldUpdae');
      return true
    }
    componentWillUnmount(){
      console.log('child unmount');
    }
    componentWillMount(){
      console.log('child willmount');
    }
    componentDidMount(){
      console.log('child mount');
    }
    componentDidUpdate(){
      console.log('child didUpdate');
    }
    componentWillUpdate(){
      console.log('child willupdate');
    }
    render(){
      console.log('child render');
      return <h1>
        child:3355
        {/* {this.props.counter} */}
      </h1>
    }
  }
  
  class Child1 extends React.Component{
    render(){
      return <div>child1</div>
    }
  }
  
  
  
  
  ReactDOM.render(<Counter />, document.getElementById('app'))
  
  ```

  