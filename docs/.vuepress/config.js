module.exports = {
  title: 'lancer博客首页', // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: 'lancer的前端学习记录', // meta 中的描述文字，用于SEO
  base: '/lancerBlog/', // 这边和github的仓库名对应上了
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
    lastUpdated: '上次更新', // string | boolean 最后更新时间
    sidebarDepth: 2, // 设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级，2为提取二级标题和三级标题
    smoothScroll: true,
    nav: [   // 顶部导航栏
      { text: '首页', link: '/' },
      {
        text: 'React学习',
        items: [
          { link: '/guide/react/', target: '_self', text: 'React17基础' }
        ]
      }, // link还可以跳转外部链接
      {
        text: 'Vue学习',
        items: [
          { link: '/guide/vue/', target: '_self', text: 'Vue2基础学习' },
          { link: '/guide/vue2Com/', target: '_self', text: 'Vue2组件' },
        ]
      },
      { text: 'css注意', link: '/guide/css/', target: '_self' },
      { text: 'js学习', link: '/guide/js/', target: '_self' },
      {
        text: '其他',
        items: [
          { link: '/guide/others/vuepress/', target: '_self', text: 'vuepress自动化部署github' },
        ]
      },
      { text: 'my-github', link: 'https://github.com/xuzhihui123?tab=repositories', target: '_blank' },
    ],
    sidebar: {
      '/guide/react/': [
        {
          title: '1、React学习部分开始',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          // sidebarDepth: 1,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          // children: [
          //   {
          //     title:'子标题1',
          //     path:'c1'
          //   }
          // ]
          path: '/guide/react/'
        },
        {
          title: '2、手写React.createElement、ReactDOM.render',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'day1'
        },
        {
          title: '3、实现函数式组件',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'day2'
        },
        {
          title: '4、实现类组件',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'day3'
        },
        {
          title: '5、合成事件和批量更新',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'day4'
        },
        {
          title: '6、初步的完整的生命周期',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'day5'
        }
      ],
      '/guide/vue/': [
        {
          title: 'Vue学习部分开始',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: '/guide/vue/'
        }
      ],
      '/guide/vue2Com/': [
        {
          title: 'Vue2组件学习',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: '/guide/vue2Com/'
        },
        {
          title: '1、虚拟滚动',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'visualScroll'
        }
      ],
      '/guide/css/': [
        {
          title: 'css学习注意点',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          // sidebarDepth: 1,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          // children: [
          //   {
          //     title:'子标题1',
          //     path:'c1'
          //   }
          // ]
          path: '/guide/css/'
        },
        {
          title: '1、BFC问题',
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path: 'css1'
        },
      ],
      '/guide/js/':[
        {
          title:"js学习注意点",
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path:'/guide/js/'
        },
        {
          title:"1、call,bind,apply实现",
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          path:'js1'
        }
      ],
      '/guide/others/vuepress/':[
        {
          title: 'vuepress自动化部署',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          // sidebarDepth: 1,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          // children: [
          //   {
          //     title:'子标题1',
          //     path:'c1'
          //   }
          // ]
          path: '/guide/others/vuepress/'
        },
      ]
    }
  }
}
