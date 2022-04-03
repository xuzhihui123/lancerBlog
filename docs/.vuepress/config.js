module.exports = {
  title: 'lancer博客首页', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: 'lancer的前端学习记录', // meta 中的描述文字，用于SEO
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link',
      { rel: 'icon', href: '/favicon.ico' }
      //浏览器的标签栏的网页图标，第一个'/'会遍历public文件夹的文件
    ],
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/home.png',
    lastUpdated: 'Last Updated', // string | boolean 最后更新时间
    smoothScroll: true,
    nav: [   // 顶部导航栏
      { text: '首页', link: '/' },
      { text: 'React学习', link: '/guide/react/', target: '_self' }, // link还可以跳转外部链接
      { text: 'Vue学习', link: '/guide/vue/', target: '_self' },
      { text: 'my-github', link: 'https://github.com/xuzhihui123?tab=repositories', target: '_blank' },
    ],
    sidebar: {
      '/guide/react/': [
        {
          title: 'React学习部分开始',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          // sidebarDepth: 1,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          // children: [
          //   {
          //     title:'子标题1',
          //     path:'c1'
          //   }
          // ]
          path:'/guide/react/'
        },
        {
          title: '1、手写React.createElement  ReactDOM.render',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path:'day1'
        }
      ],
      '/guide/vue/': [
        {
          title: 'Vue学习部分开始',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          // sidebarDepth: 1,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          // children: [
          //   {
          //     title:'子标题1',
          //     path:'c1'
          //   }
          // ]
          path:'/guide/vue/'
        }
      ]
    }
  }
}
