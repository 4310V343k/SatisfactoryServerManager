FROM ubuntu:20.04

RUN apt-get update -y && apt-get install wget curl lib32gcc1 -y

RUN mkdir -p /root/.SatisfactoryServerManager
RUN mkdir -p /root/.config/Epic/FactoryGame


RUN mkdir /SSM
VOLUME /SSM
COPY release-builds/linux/ /SSM

EXPOSE 3000/tcp

ENTRYPOINT [ "/SSM/SatisfactoryServerManager", "--agent" ]
