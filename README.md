# edge-download-deploy-proxy-grunt-script
This grunt script will download proxy and config from Edge to the file system.  It can also be used to build and deploy proxies, configs and shared flows.

Grunt Download, Build, Deploy Tool
=========
This script will download, build and deploy

### Script Installation

Follow these steps to install the build/deploy script on a Windows machine

Install NodeJS 

Download NodeJS installer: https://nodejs.org/en/download/

Download and run the 64-bit installer

Install Grunt

Open the NodeJS command prompt (run as administrator)

Start Button → applications → Node.js → Node.js command prompt (right click to run as administrator)

run the command:

npm install -g grunt-cli 

Refer to instructions for more detail: http://gruntjs.com/getting-started

Install libraries

cd builddeploytool

npm install


### Commands

--debug --curl options will display more debug information to the command window.  These options are not required

 
##Build and Deploy Commands

grunt --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt importCaches --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt importKVMs --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt importTargetServers --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt importAPIProducts --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt deployApiProductConfig --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt deployCompanyConfig --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}

grunt deployAppConfig --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/{proxy-folder}



##Build and Deploy Example

grunt --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/messages-mock-api-v1

grunt importKVMs --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/messages-mock-api-v1

grunt deploySharedFlowBundle --env=test --username={username} --password={password} --debug --curl=true --folderPath=../proxies/SharedFlow_FaultRulesHanding



Based on: [Apigee Deploy Grunt Plugin Git Repo](https://github.com/apigeecs/apigee-deploy-grunt-plugin) and [edge-download-deploy-grunt-script](https://github.com/davidmehi/edge-download-deploy-grunt-script).


