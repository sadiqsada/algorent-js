# AlgoRent
Algorent is a platform for conducting real-estate transactions with crypto. We hope to eliminate the overhead of the current system with a faster, secure, verifiable, unforgeable system.

## Installation
* Clone this repository

        git clone https://github.com/sadiqsada/algorent-js.git

* Running the client (from project root containing this README.md file)

       cd client
       npm install 
       npm start
       
* Running the server (from project root containing this README.md file)

       cd server
       npm install
       npm install -g nodemon
       npm start

* Connecting to the database

       Create a .env file in the server root
       Paste the string from discord in .env

* In order to make the scraper work, conda will have to be installed.

       Download and install conda from the link below
       https://docs.conda.io/projects/conda/en/latest/user-guide/install/download.html

       conda activate 

* To confirm email when registering an account

       register an account on mailtrap.io
       go to inbox -> SMTP Settings
       select nodemailer from Integrations dropdown
       copy the user and pass to server/utils/sendEmails.js
       verification emails will show up in mailtrap inbox

* Using linting/formatting in /server directory (please resolve all linting/formatting issues before merging)

       linting: npm run lint
       formatting: npm format

* To setup Algorand TestNet Environment.
       Download and install Docker Compose 
       https://docs.docker.com/compose/install/

       Clone the Algorand Docker Node Instance
       git clone https://github.com/algorand/sandbox.git

       cd into the sandbox directory and run the command: ./sandbox up testnet

       Install the Python SDK 
       pip3 install py-algorand-sdk

       Comments on the scripts will explain how it works so you can make your own wallets and fund them on your own.
       
### Notes
* Nodemon keeps the server running as changes are made to the files so that the server doesn't have to be restarted. -g flag stands for global. Installing it globally will allow you to use it for other projects.

* If you need to change the python scraper directory, make sure to delete the environment and remake it in the updated directory.
* To install required libraries use : ```pip install -r requirements```
* Fixing package-lock merge conflicts

       don't resolve conflicts directly on package-lock.json
       resolve conflicts on package.json
       do npm install