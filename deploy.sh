#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# If you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# Replace <USERNAME> and <REPO> with your details
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

echo "Build complete and git initialized in /dist."
echo "To finish deployment, uncomment the 'git push' line in this script with your repo URL,"
echo "or run the command manually: git push -f git@github.com:USERNAME/REPO.git main:gh-pages"

cd -
