tumblr-trends
=============

Track popular posts on Tumblr to find currently trending


### Bugs ###
After a long period of time, the server becomes full of too much useless trackings and takes too long to query.  
I will make some method tmr to delete these useless trackings from the database.

Also, if there are too many likes for example http://www.tumblr.com/liked/by/thisistheverge, the code might run forever.  Not sure if we should put a limit on that or not.

### Instructions from Kevin to use MySQL: ###

##### Install the MySQL module for Node.js: #####
- open up the terminal and cd to your project folder
-  type the following line in terminal / command line
- npm install mysql@2.0.0-alpha7
- This will install a package folder inside your project folder

- Note: I included the mysql package inside our repo



##### Installing a local MySQL server on your home computer: #####
- For windows I downloaded the installer: http://dev.mysql.com/downloads/installer/
- other platfroms downloads are at: http://dev.mysql.com/downloads/mysql/5.6.html#downloads
- -
- instructions for windows: http://timlin.net/csm/cis363/mysql.pdf
- instructions for mac os x: http://blog.mclaughlinsoftware.com/2011/02/10/mac-os-x-mysql-install/
