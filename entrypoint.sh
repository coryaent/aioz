#!/bin/bash

# Initialize private key if one does not exist
if ! test -f /root/.aiozworker/privkey.json; then
  mkdir -p /root/.aiozworker/
  aioznode keytool new | jq -r .priv_key > /root/.aiozworker/privkey.json
fi

# Pass arguments to aioznode
exec aioznode "$@"
