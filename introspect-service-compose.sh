#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
rover subgraph introspect "$APOLO_SERVICE_USER_URL" --output ./graphql/user.graphql

rover subgraph introspect "$APOLO_SERVICE_PRODUCT_URL" --output ./graphql/product.graphql 

APOLO_KEY=service:Spotify-Demo-Graph-picxde:fHTQ4bQMr5_DajU50kI7kQ rover supergraph compose --config ./supergraph.yaml --output ./graphql/supergraph.graphql
