# AIOZ
```bash
docker run -it --rm -p 2222:22 -v ./debian:/root debian bash

apt update && apt install -y openssh-server && mkdir -p /run/sshd && /usr/sbin/sshd
```

To access as root, edit `/etc/ssh/sshd_config`:
```
...
PermitRootLogin prohibit-password
...
```

1. Generate keys

2. Copy `id_rsa.pub` to `/root/.ssh/authorized_keys` (docker config)

3. Create a secret from `id_rsa`

4. To connect: `ssh -q -o "StrictHostKeyChecking no" -p 2222 root@localhost`

