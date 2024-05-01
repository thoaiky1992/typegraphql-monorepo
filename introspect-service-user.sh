#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
rover subgraph introspect "$APOLO_SERVICE_USER_URL" --output ./graphql/user.graphql
