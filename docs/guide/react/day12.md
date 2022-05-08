例子代码

```js
// import React from './source/createElement';
// import ReactDOM from './source/react-dom';
import React from 'react'
import ReactDOM  from 'react-dom'

 
class Hello extends React.Component{
  state = {
    x:0,
    y:0
  }
  mouseMove=(e)=>{
    this.setState({
      x:e.clientX,
      y:e.clientY
    })
  }
  render(){
    return (
      <div>
         <h1 onMouseMove={this.mouseMove}>测试指针坐标</h1>
          {
            this.props.children(this.state)
          }
      </div>
    )
  }
}




// 传参函数
ReactDOM.render(<Hello>
  {
    renderProps=>{
      return (<p>
        x坐标:{renderProps.x},y坐标:{renderProps.y}
     </p>)
    }
  }
</Hello>, document.getElementById('app'))




```

