- 
  此篇为react17基础知识原理手写


- 获取源代码项目github[地址](https://github.com/xuzhihui123/react_study-base)
- 获取源码目录对照学习
- 从第6点开始将开始使用以下写好的源码来讲解。（[6、初步的完整的生命周期](/guide/react/day5.html)）

## 1.1、目录介绍



![目录架构](/lancerBlog/react/2.png)

- **source/createElement.js  对标react**

- **source/react-dom.js 对标 react-dom**

- **package.json**

  ```json
  {
    "name": "react_study-3.27",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "@testing-library/jest-dom": "^5.16.3",
      "@testing-library/react": "^12.1.4",
      "@testing-library/user-event": "^13.5.0",
      "cors": "^2.8.5",
      "express": "^4.17.3",
      "react": "^17.0.2",
      "react-dom": "^17.0.2",
      "react-scripts": "5.0.0",
      "web-vitals": "^2.1.4"
    },
    "scripts": {
      "start": "set DISABLE_NEW_JSX_TRANSFORM=true && react-app-rewired start",
      "build": "set DISABLE_NEW_JSX_TRANSFORM=true && react-app-rewired build",
      "test": "react-app-rewired test",
      "eject": "react-app-rewired eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
    "devDependencies": {
      "@babel/core": "^7.17.9",
      "@babel/plugin-proposal-decorators": "^7.17.9",
      "@babel/preset-env": "^7.16.11",
      "customize-cra": "^1.0.0",
      "react-app-rewired": "^2.2.1"
    }
  }
  
  ```

  **react 和 react-dom 均为17版本**

- **.env.local**

  设置DISABLE_NEW_JSX_TRANSFORM=true，表示不使用react17自带的jsx转换，React 17编译器从react/jsx-runtime导入了一个新的依赖项，它处理JSX转换。

  可以看一下旧版React组件中该怎么写，可以看到在写组件的时候都需要引入React，因为这是为了使用React.createElement这个方法。

  ![旧版组件写法](/lancerBlog/react/3.png)

  React17之后就不需要为了jsx导入React了，如下图，React 17编译器从react/jsx-runtime导入了一个新的依赖项，它处理JSX转换。

  ![17之后组件写法](/lancerBlog/react/4.png)

  





