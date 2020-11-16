#!/bin/bash
#
#Inital setup script, to be run once.
#Will setup systemd service and build


#Color Constants
RED="\033[0;31m"
GREEN="\033[0;32m"
NC="\033[0m"


#First check if we are root, script needs root to install services/node
if [ "$EUID" -ne 0 ]
    then
        echo "${RED}Setup script must be ran as root. Please try 'sudo sh setup.sh'"
        exit 1
fi

#Check if nodejs is installed
if which node > /dev/null
    then
        #node is installed can continue and update 
        echo "${GREEN}Node installed ✓"
    else
        #node isn't installed, install it
        echo "${RED}Node not found, Installing"
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs
fi

#Navigate to the dashboard folder and install the node dependencies
echo "${GREEN}Installing Node Dependencies"
cd "./dashboard/"
npm install

echo "${GREEN}Dependencies installed, setting up systemd service"
cd "../setup/"
sudo mv "dashboard.service" "/lib/systemd/system/"

echo "${GREEN}Enabling service"
sudo systemctl enable dashboard.service

echo "${GREEN}Service has been enabled, reboot to start the dashboard"
echo "${GREEN}To start the dashboard, run: 'sudo systemctl start dashboard'"
echo "${GREEN}To stop the dashboard, run: 'sudo systemctl stop dashboard' "