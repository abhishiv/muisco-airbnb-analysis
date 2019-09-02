#!/usr/bin/env bash
#./node_modules/.bin/bsb -make-world
set -eE
env NODE_ENV=production ./node_modules/.bin/webpack --config ./tools/webpack/webpack.production.config.js
./node_modules/.bin/babel ./src --extensions ".ts,.tsx,.js,.jsx" --out-dir build --copy-files

