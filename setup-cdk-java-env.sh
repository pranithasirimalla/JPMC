#!/bin/bash
# Script to set up AWS CDK Java development environment
set -e

echo "Updating package lists..."
sudo apt-get update

echo "Installing Java (OpenJDK 17) and Maven..."
sudo apt-get install -y openjdk-17-jdk maven

echo "Installing AWS CLI v2..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws/

echo "Installing Node.js (LTS 20.x) and npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Installing AWS CDK globally..."
sudo npm install -g aws-cdk

echo "Environment setup complete!"
java -version
mvn -version
aws --version
node -v
npm -v
cdk --version
