FROM ubuntu:20.04

RUN apt-get update -y && apt-get install wget curl lib32gcc1 -y

RUN useradd -ms /bin/bash ssm

ADD --chown=ssm release-builds/linux /home/ssm/SSM

USER ssm
WORKDIR /home/ssm/SSM

EXPOSE 3000/tcp

ENTRYPOINT [ "/home/ssm/SSM/SatisfactoryServerManager", "--agent" ]
