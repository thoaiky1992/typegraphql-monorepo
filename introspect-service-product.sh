#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
npx @apollo/rover subgraph introspect "$APOLO_SERVICE_PRODUCT_URL" --output ./packages/service-gateway/graphql/product.graphql
