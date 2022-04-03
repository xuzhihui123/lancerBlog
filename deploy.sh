#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git add -A
git commit -m 'deploy'

# 下面是git的ssh仓库地址
git push -f git@gitee.com:itlancer/my-blog.git 

cd -