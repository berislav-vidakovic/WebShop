#!/bin/bash
set -e

# Stop and remove any existing container
docker rm -f hasura-test >/dev/null 2>&1 || true

docker run -d --name hasura-test -p 8088:8080 \
-e HASURA_GRAPHQL_DATABASE_URL=postgres://barry75:abc123@barryonweb.com:5432/webshop_test \
-e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
-e HASURA_GRAPHQL_ENABLE_TELEMETRY=false \
hasura/graphql-engine:v2.30.0

echo "Hasura Test started on Port 8088"