# AIOZ
`entrypoint.sh` automatically creates a new aioz private key file in the correct format if no file exists and edits the default `sshd` configuration to allow root login

## Running
*do not forget flag `--no-auto-update`*
1. Generate ssh keys
2. Copy `id_rsa.pub` to `/root/.ssh/authorized_keys` (use a docker docker config)
3. Create a (docker) secret from `id_rsa`
4. To connect: `ssh -q -o "StrictHostKeyChecking no" -p 2222 root@localhost`
