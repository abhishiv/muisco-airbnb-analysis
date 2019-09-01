#!/usr/bin/env bash
set -eE
export UV_THREADPOOL_SIZE=128
echo $sha
if [ "$NODE_ENV" == "production" ]
then
  echo "starting server in production"
  export PUBLIC_URL="https://muis.co";
  node build/server/index.js
else
  echo "starting server in development"
  export PUBLIC_URL="http://localhost:5000";
  export NODE_TLS_REJECT_UNAUTHORIZED='0'
  ./node_modules/.bin/babel-node --extensions '.ts,.tsx,.js,.jsx' src/server/server.ts
  
fi
