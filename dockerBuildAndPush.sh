#!/bin/bash
docker build -t marstourist .
docker tag marstourist:latest webappsandapis.azurecr.io/marstourist:latest
az acr login --name webappsandapis
docker push webappsandapis.azurecr.io/marstourist:latest