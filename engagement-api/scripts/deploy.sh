#!/usr/bin/env bash
set -euo pipefail

resource_group="${1:-tanayjha-blog-rg}"
location="${2:-eastus2}"
allowed_origin="${3:-https://tanayjha-blog.vercel.app}"
suffix="$(openssl rand -hex 3)"
storage_account="tjblogeng${suffix}"
function_app="tanayjha-blog-engagement-${suffix}"

az group create \
  --name "${resource_group}" \
  --location "${location}" \
  --output none

az storage account create \
  --name "${storage_account}" \
  --resource-group "${resource_group}" \
  --location "${location}" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --output none

connection_string="$(az storage account show-connection-string \
  --name "${storage_account}" \
  --resource-group "${resource_group}" \
  --query connectionString \
  --output tsv)"

az functionapp create \
  --name "${function_app}" \
  --resource-group "${resource_group}" \
  --storage-account "${storage_account}" \
  --consumption-plan-location "${location}" \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --os-type Linux \
  --output none

az functionapp config appsettings set \
  --name "${function_app}" \
  --resource-group "${resource_group}" \
  --settings \
    "ALLOWED_ORIGINS=${allowed_origin},http://localhost:1313,http://127.0.0.1:1313" \
    "ENGAGEMENT_STORAGE_CONNECTION_STRING=${connection_string}" \
  --output none

npm install
func azure functionapp publish "${function_app}" --javascript

echo "API base URL: https://${function_app}.azurewebsites.net/api"
