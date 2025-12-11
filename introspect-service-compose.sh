#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
echo "🔍 Introspecting user service..."
npx @apollo/rover subgraph introspect "$APOLO_SERVICE_USER_URL" --output ./packages/service-gateway/graphql/user.graphql

echo "🔍 Introspecting product service..."
npx @apollo/rover subgraph introspect "$APOLO_SERVICE_PRODUCT_URL" --output ./packages/service-gateway/graphql/product.graphql 

echo "🚀 Composing supergraph..."
npx --yes @apollo/rover supergraph compose --config ./supergraph.yaml --output ./packages/service-gateway/graphql/supergraph.graphql