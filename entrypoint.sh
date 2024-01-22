#!/bin/bash

# Modify default sshd_config
sed -i s/#Port\ 22.*/Port\ 13172/ /etc/ssh/sshd_config
sed -i s/#PermitRootLogin\ prohibit-password.*/PermitRootLogin\ prohibit-password/ /etc/ssh/sshd_config

# Create directory for keys
mkdir -p /root/.ssh

# Start ssh server
/usr/sbin/sshd

# Initialize private key if one does not exist
if ! test -f /root/.aiozworker/privkey.json; then
  mkdir -p /root/.aiozworker/
  aioznode keytool new | jq -r .priv_key > /root/.aiozworker/privkey.json
fi

# Pass arguments to aioznode
aioznode "$@"
