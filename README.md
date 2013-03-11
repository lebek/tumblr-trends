tumblr-trends
=============

Track popular posts on Tumblr to find currently trending


### Bugs ###
There is currently a really weird bug if our server is keeping track of more than one blog.
It occurs inside server.js > function track()
It happens because node.js is asynchonous, and only inserts the last blog it reads.
I tried to use the Node module: async from https://github.com/caolan/async but could not figure out a solution.


### Instructions from Kevin to use MySQL: ###

##### Install the MySQL module for Node.js: #####
- open up the terminal and cd to your project folder
-  type the following line in terminal / command line
- "npm install mysql@2.0.0-alpha7"
- This will install a package folder inside your project folder

- Note: i wasnt sure if i should upload this folder to the github repo
- the MySQL module is from: https://github.com/felixge/node-mysql



##### Installing a local MySQL server on your home computer: #####
- For windows I downloaded the installer: http://dev.mysql.com/downloads/installer/
- other platfroms downloads are at: http://dev.mysql.com/downloads/mysql/5.6.html#downloads
- -
- instructions for windows: http://timlin.net/csm/cis363/mysql.pdf
- instructions for mac os x: http://blog.mclaughlinsoftware.com/2011/02/10/mac-os-x-mysql-install/
