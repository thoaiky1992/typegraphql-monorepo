#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
rover graph introspect "$APOLO_SERVICE_PRODUCT_URL" --output ./graphql/product.graphql
