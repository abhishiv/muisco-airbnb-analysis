#!/usr/bin/env bash

./node_modules/.bin/typedoc --excludeExternals  --externalPattern "**/node_modules/**"  --includeDeclarations --theme default --out docs/ src/
