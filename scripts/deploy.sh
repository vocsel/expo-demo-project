#!/bin/bash

export $(grep -v '^#' .env | xargs)

if [ -z $DEPLOY_HOST ]; then
  echo "Please, set up variable DEPLOY_HOST in .env file"
  exit 0
fi

yarn build

ssh $DEPLOY_HOST "rm -rf /var/www/html/.projects-templates/gallery-shop"
ssh $DEPLOY_HOST "mkdir -p /var/www/html/.projects-templates/gallery-shop"

scp -r __dist__/* "$DEPLOY_HOST:/var/www/html/.projects-templates/gallery-shop"