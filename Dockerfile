FROM ubuntu:20.04

RUN apt-get update -y && apt-get install wget curl lib32gcc1 -y

RUN useradd -ms /bin/bash ssm

USER ssm

RUN mkdir -p /home/ssm/.SatisfactoryServerManager
RUN mkdir -p /home/ssm/.config/Epic/FactoryGame

RUN mkdir /home/ssm/SSM
VOLUME /home/ssm/SSM
COPY release-builds/linux/ /home/ssm/SSM

EXPOSE 3000/tcp

ENTRYPOINT [ "/home/ssm/SSM/SatisfactoryServerManager", "--agent" ]
