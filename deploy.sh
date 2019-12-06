#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd blog/.vuepress/dist

# if you are deploying to a custom domain
echo 'ahemery.dev' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Ant-hem/ant-hem.github.io.git master

cd -