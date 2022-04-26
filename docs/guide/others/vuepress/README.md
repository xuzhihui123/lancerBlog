## 1、克隆vuepress模版

- 进入[github地址](https://github.com/xuzhihui123/lancerBlog.git)进行clone项目

- 目录介绍

  ![目录1](/lancerBlog/others/dir1.png)

  

  [.github/workflows/blog.yml (为创建自动化部署工作流)](#_2、自动化部署工作流)

  docs目录为vuepress固定目录

  .vuepress/dist 为打包后的文档静态页面

  .vuepress/public 为公共静态资源

  主要看.vuepress/config.js 为配置看代码就能大概了解

  guide目录主要为页面文档看代码就能大概了解

  guide/README.md 为首页展示配置 看代码就能大概了解

## 2、推送到github

先新建一个github仓库，推送代码到github，例如我这个仓库名是lancerBlog，那么在项目目录的docs/.vuepress/config.js里做一个base基础目录配置，如图所示配置了base："/lancerBlog/"

![image-20220426215753636](/lancerBlog/others/dir4.png)

## 3、自动化部署工作流

- blog.yml 名字blog可以随便起

- 当推送到github自动会执行blog.yml 

  ```yaml
  # 自定义当前执行文件的名称
  name: GitHub Actions Build and Deploy Demo
  # 整个流程在master分支发生push事件时触发
  on:
    push:
      branches:
        - main    # 意思是在git push到main分支的时候就执行以下jobs
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest # 运行在ubuntu-latest环境的虚拟机中
      steps:
      # 获取仓库源码
      - name: Checkout
        uses: actions/checkout@v2
        with:
          persist-credentials: false
      # 构建和部署
      - name: Install and Build
        # 由于示例项目代码并非在根目录,所以要这里手动进入了项目目录
        # 如果你代码本身就处于根目录则不需要再手动进入了
        run: |
          yarn install   # 安装包
          yarn docs:build  # 打包
      # 发布到github
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@releases/v3
        # 环境变量
        with:
          ACCESS_TOKEN: ${{ secrets.BLOG }} # GitHub 密钥 ACCESS_TOKEN 是在第二步Settings的Secrets中新增时定义的Name,要保持一致
          # 发布到指定分支
          BRANCH: gh-pages
          # 构建成果所在目录,默认位置都是在根目录
          FOLDER: docs/.vuepress/dist
  ```

  ```
  ACCESS_TOKEN: ${{ secrets.BLOG }} 为配置的密钥
  ```

  secrets.BLOG 配置流程 ： 进入github的settings/developer settings/Personal access tokens ，生成一个tokens，如下图,

  **note可以随便命名，然后生成tokens，此时记得复制起来，等等用到。**

  ![image-20220426214723859](/lancerBlog/others/dir2.png)

  然后进入个人的博客仓库的settigs，点击secrets/actions ，点击new repository secret 新建一个仓库密钥，如下图，name为**BLOG**，value为刚刚复制好的tokens，然后add secret，此时仓库的私钥就配置好了。再下次进行push的时候就会执行blog.yml的命令，进行部署并把打包好的静态文档发布了，发布分支为gh-pages

  ![image-20220426215056456](/lancerBlog/others/dir3.png)

  

## 4、部署到gitee

```yaml

   # 3、同步到 gitee 的仓库
    - name: Sync to Gitee
      uses: wearerequired/git-mirror-action@master
      env:
        # 注意在 Settings->Secrets 配置 GITEE_RSA_PRIVATE_KEY
        SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
      with:
        # 注意替换为你的 GitHub 源仓库地址
        source-repo: git@github.com:xuzhihui123/lancerBlog.git
        # 注意替换为你的 Gitee 目标仓库地址
        destination-repo: git@gitee.com:itlancer/lancerBlog.git

    # 4、部署到 Gitee Pages
    - name: Build Gitee Pages
      uses: yanglbme/gitee-pages-action@main
      with:
        # 注意替换为你的 Gitee 用户名
        gitee-username: itlancer
        # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
        gitee-password: ${{ secrets.GITEE_PASSWORD }}
        # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
        # itlancer为用户名，lancerBlog为仓库名字
        gitee-repo: itlancer/lancerBlog
        # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
        branch: gh-pages
```

- 再blog.yml 中添加上述配置。 **uses: wearerequired/git-mirror-action@master** 配置就是利用外部别人写好的插件。

- secrets.GITEE_RSA_PRIVATE_KEY

  没错，这里就是 RSA 的私钥，这里如果你不熟悉 RSA，可能会产生困惑，不是说公钥在网上传输，私钥不公开吗？没错，确实是这样，Gitee 上保存你账户对应的公钥，GitHub 仓库的 secrets.GITEE_RSA_PRIVATE_KEY 保存着私钥，因为 GitHub 的服务器不会让你亲自登录设置密钥对，因此需要配置 secrets.GITEE_RSA_PRIVATE_KEY 来告知 GitHub，解密操作需要的私钥并不是在网上传输，只有自己知道。GitHub Actions 的服务器会使用你的账户登录 Gitee，Gitee 使用你的公钥加密后传输给这台服务器。
  打开终端，输入以下命令：

  ```
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```

  一路回车之后在 `~/.ssh` 目录下可以看到 id_rsa、id_rsa.pub 等文件，其中私钥就是 **id_rsa**，公钥就是 **id_rsa.pub**，这就是密钥对，一个可用于加密，另一个可用于解密。

  进入gitee配置公钥

  ![image-20220426222314097](/lancerBlog/others/dir5.png)

  进入github配置私钥

  ![image-20220426222559021](/lancerBlog/others/dir6.png)

- secrets.GITEE_PASSWORD

  这边就是gitee的用户登录密码了，还是一样进入个人的博客仓库的settigs，点击secrets/actions ，点击new repository secret 新建一个仓库密钥，name为secrets.GITEE_PASSWORD，value为gitee用户登录密码

  

  



  

  ​         

