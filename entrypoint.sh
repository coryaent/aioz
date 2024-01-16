#!/bin/bash
sed -i s/#PermitRootLogin\ prohibit-password.*/PermitRootLogin\ prohibit-password/ /etc/ssh/sshd_config
mkdir -p /root/.ssh
/usr/sbin/sshd
if ! test -f /root/.aiozworker/privkey.json; then
  mkdir -p /root/.aiozworker/
  aioznode keytool new | jq -r .priv_key > /root/.aiozworker/privkey.json
  echo "Created new private key"
fi
aioznode "$@"
