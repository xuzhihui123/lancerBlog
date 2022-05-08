## 11.1 React.cloneElement

```js
function cloneElement(oldVdom,newProps,...newChildren){
  let props = {...oldVdom.props,...newProps}
  if(!props.children){
    props.children = newChildren.map(wrapToVdom)
  }else{
    if(!Array.isArray(props.children)){
       props.children =[props.children,...newChildren].map(wrapToVdom)
    }else{
       props.children = [...props.children,...newChildren].map(wrapToVdom)
    }
  }

  return {
    ...oldVdom,
    props
  }
}
```

## 11.2 反向继承例子

- 高阶组件反向继承 -》 可以扩展原来组件的内容

```js
import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'

 
// 高阶组件反向继承 -》 可以扩展原来组件的内容

const wrapHello = Hello=>{
  return class newHello extends Hello{
    state = {
      age:123
    }
    good = {
      age:123
    }
    click=()=>{
      console.log('你好啊');
    }
    div(){
      return <div>{this.good.age}</div>
    }
    render(){
      // 拿到继承的render
      let oldElement = super.render()
      // 克隆一份虚拟dom，传入属性和儿子
      let cloneElement = React.cloneElement(oldElement,{
        onClick:this.click,
        age:this.state.age
      },this.good.age,this.div())
      return cloneElement
    }
  }
}

@wrapHello
class Hello extends React.Component{
  state = {
    name: 'hello name'
  }
  hello=()=>{
    console.log(this);
  }
  render(){
    return (
      <button name={this.state.name}>

      </button>
    )
  }
}



ReactDOM.render(<Hello />, document.getElementById('app'))

```

