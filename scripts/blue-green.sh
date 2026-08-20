#!/bin/bash

TARGET=$1        # blue or green
DOCKERHUB_USER=$2
DB_PASSWORD=$3

BLUE_FRONTEND_PORT=8081
BLUE_BACKEND_PORT=3011
GREEN_FRONTEND_PORT=8082
GREEN_BACKEND_PORT=3012
NGINX_PORT=80

if [ "$TARGET" == "blue" ]; then
  FRONTEND_PORT=$BLUE_FRONTEND_PORT
  BACKEND_PORT=$BLUE_BACKEND_PORT
  OLD_TARGET="green"
  OLD_FRONTEND_PORT=$GREEN_FRONTEND_PORT
  OLD_BACKEND_PORT=$GREEN_BACKEND_PORT
else
  FRONTEND_PORT=$GREEN_FRONTEND_PORT
  BACKEND_PORT=$GREEN_BACKEND_PORT
  OLD_TARGET="blue"
  OLD_FRONTEND_PORT=$BLUE_FRONTEND_PORT
  OLD_BACKEND_PORT=$BLUE_BACKEND_PORT
fi

echo "Deploying to $TARGET environment..."

# Pull latest images
docker pull $DOCKERHUB_USER/inventory-frontend:$TARGET
docker pull $DOCKERHUB_USER/inventory-backend:$TARGET

# Start new environment
docker run -d \
  --name frontend-$TARGET \
  --network inventory-net \
  -p $FRONTEND_PORT:5173 \
  $DOCKERHUB_USER/inventory-frontend:$TARGET

docker run -d \
  --name backend-$TARGET \
  --network inventory-net \
  -p $BACKEND_PORT:3001 \
  -e DATABASE_URL=postgresql://postgres:$DB_PASSWORD@postgres:5432/inventory \
  -e NODE_ENV=production \
  $DOCKERHUB_USER/inventory-backend:$TARGET

# Wait for new environment to be healthy
echo "Waiting for $TARGET to be healthy..."
sleep 10

HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT/health)

if [ "$HEALTH" == "200" ]; then
  echo "$TARGET is healthy. Switching nginx traffic..."

  # Update nginx to point to new environment
  sed -i "s/proxy_pass http:\/\/frontend-$OLD_TARGET/proxy_pass http:\/\/frontend-$TARGET/" /etc/nginx/conf.d/default.conf
  sed -i "s/proxy_pass http:\/\/backend-$OLD_TARGET/proxy_pass http:\/\/backend-$TARGET/" /etc/nginx/conf.d/default.conf
  nginx -s reload

  # Stop old environment
  echo "Stopping $OLD_TARGET environment..."
  docker stop frontend-$OLD_TARGET backend-$OLD_TARGET 2>/dev/null || true
  docker rm frontend-$OLD_TARGET backend-$OLD_TARGET 2>/dev/null || true

  echo "Blue/Green deployment complete. Traffic now on $TARGET."
else
  echo "Health check failed ($HEALTH). Rolling back..."
  docker stop frontend-$TARGET backend-$TARGET 2>/dev/null || true
  docker rm frontend-$TARGET backend-$TARGET 2>/dev/null || true
  exit 1
fi
