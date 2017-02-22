FROM terranodo/django:geonode
MAINTAINER Ariel Núñez<ariel@terranodo.io>

## Install Java

RUN \
  apt-get update -y && \
  apt-get install -y openjdk-7-jdk && \
  rm -rf /var/lib/apt/lists/*

# Define commonly used JAVA_HOME variable
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

## Install Ant

ENV ANT_VERSION 1.9.4
RUN cd && \
    wget -q http://archive.apache.org/dist/ant/binaries/apache-ant-${ANT_VERSION}-bin.tar.gz && \
    tar -xzf apache-ant-${ANT_VERSION}-bin.tar.gz && \
    mv apache-ant-${ANT_VERSION} /opt/ant && \
    rm apache-ant-${ANT_VERSION}-bin.tar.gz

ENV ANT_HOME /opt/ant
#Adding ANT into bin
ENV PATH ${PATH}:/opt/ant/bin

WORKDIR /usr/src/app/src/geonode-client
RUN ant dist

WORKDIR /usr/src/app
#how is the best way to compile geonode-client????
#Lennin: Compile code goes here.
#make sure directory
#RUN ant dist
