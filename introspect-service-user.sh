#!/bin/bash

# Load environment variables
source .env

# Run the introspect command with the endpoint from the environment variable
rover graph introspect "$APOLO_SERVICE_USER_URL" --output ./graphql/user.graphql
