#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
rover subgraph introspect "$APOLO_SERVICE_PRODUCT_URL" --output ./graphql/product.graphql
