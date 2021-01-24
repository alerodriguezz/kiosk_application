#!/bin/bash
echo "Downloading Maven"
sudo wget http://www.eu.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
sudo tar -xzvf apache-maven-3.3.9-bin.tar.gz -C /var/lib/
export M2_HOME=/var/lib/apache-maven-3.3.9
export PATH=$PATH:$M2_HOME/bin
echo "Installing openjdk"
sudo yum install -y java-1.8.0-openjdk-devel
echo "Configuring Java"
sudo alternatives --set java /usr/lib/jvm/jre-1.8.0-openjdk.x86_64/bin/java
echo "Removing old version"
sudo yum remove -y java-1.7.0-openjdk-devel
export JAVA_HOME=/usr/lib/jvm/java
echo "Downloading Maven SDK"
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install gradle 6.5
