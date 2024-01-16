#!/bin/bash
sed -i s/#PermitRootLogin\ prohibit-password.*/PermitRootLogin\ prohibit-password/ /etc/ssh/sshd_config
/usr/sbin/sshd
aioznode "$@"
