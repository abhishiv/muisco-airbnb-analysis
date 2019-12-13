export NODE_TLS_REJECT_UNAUTHORIZED='0'
./node_modules/.bin/get-graphql-schema http://localhost:5000/graphql > ./tools/schema.graphql
./node_modules/.bin/get-graphql-schema http://localhost:5000/graphql --json > ./tools/schema.json
./node_modules/.bin/graphql-schema-typescript generate-ts ./tools/schema.graphql --typePrefix Muisco --output ./src/types/graphql.ts
