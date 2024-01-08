FROM ubuntu:22.04

WORKDIR /root

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y wget && \
    wget https://github.com/AIOZNetwork/aioz-dcdn-cli-node/files/13561211/aioznode-linux-amd64-1.1.0.tar.gz && \
    tar xf aioznode-linux-amd64-1.1.0.tar.gz && \
    mv ./aioznode-linux-amd64-1.1.0 /usr/local/bin/aioznode && \
    rm aioznode-linux-amd64-1.1.0.tar.gz

ENTRYPOINT ["aioznode"]
