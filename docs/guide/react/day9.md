## 10.1 使用装饰器的步骤

- 安装依赖

```js
  "devDependencies": {
    "@babel/core": "^7.17.9",
    "@babel/plugin-proposal-decorators": "^7.17.9",
    "@babel/preset-env": "^7.16.11",
    "customize-cra": "^1.0.0",
    "react-app-rewired": "^2.2.1"
  }
```

- 配置scripts脚本命令

  ```js
    "devDependencies": {
      "@babel/core": "^7.17.9",
      "@babel/plugin-proposal-decorators": "^7.17.9",
      "@babel/preset-env": "^7.16.11",
      "customize-cra": "^1.0.0",
      "react-app-rewired": "^2.2.1"
    }
  ```

- 配置config-overrides.js 改写webpack配置

  ```js
  const {override,addDecoratorsLegacy} = require('customize-cra')
  const path = require('path')
  
  function resolve(dir) {
    return path.join(__dirname, dir)
  }
  
  const customize = () => (config, env) => {
    config.resolve.alias['@'] = resolve('src')
    if (env === 'production') {
        config.externals = {
            'react': 'React',
            'react-dom': 'ReactDOM'
        }
    }
  
    return config
  };
  
  
  module.exports = override(
    addDecoratorsLegacy(), 
    customize()
  )
  ```

## 10.2 高阶组件的使用

- 高阶组件就是一个函数，参数是组件，并且返回一个组件

- 高阶组件之属性代理

  可以看到任意一个子组件都可以使用messageFun这个高阶组件的show

例子代码

```js
import React from './source/createElement';
import ReactDOM from './source/react-dom';
// import React from 'react'
// import ReactDOM  from 'react-dom'

let messageFun = str => OldComponent=>{
  return class NewHello extends React.Component{
    show=()=>{
      let message = document.createElement('div')
      message.id = 'message'
      message.style = "position:absolute;top:50%;left:50%;color:red;border:1px solid red"
      message.innerHTML = `<p>${str}</p>`
      document.body.appendChild(message)
    }
    hide=()=>{
      document.getElementById('message').remove()
    }
     render(){
       let extraProps = {show:this.show,hide:this.hide}
       return  <OldComponent {...this.props} {...extraProps}/> 
     }
  }
}



@messageFun('hello lancer')
class Hello extends React.Component{
  render(){
    return   (<div>
      <p>{this.props.good}</p>
    <button onClick={this.props.show}>显示</button>
    <button onClick={this.props.hide}>
       隐藏
    </button>
 </div>)
  }
}




ReactDOM.render(<Hello good={'你好lancer'}/>, document.getElementById('app'))

```

