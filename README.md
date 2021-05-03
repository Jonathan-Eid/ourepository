### Dependencies:
- Install PHP
- Install Composer for PHP
- Install Node.js
- Install [libvips](https://libvips.github.io/libvips/install.html)
    - Check installation with `vipsthumbnail -h`
    - Ubuntu Install : ```sudo apt-get install libvips-tools```

- Install GDAL
    - [Instructions for Windows](https://sandbox.idre.ucla.edu/sandbox/tutorials/installing-gdal-for-windows)
        - May be able to skip the Python bindings part
    - Check installation with `gdalinfo --version`
    - [Instructions for Ubuntu](https://mothergeo-py.readthedocs.io/en/latest/development/how-to/gdal-ubuntu-pkg.html)

### Make sure mysqli is enabled for PHP

#### Create SQL DB info file

Fill in the fields with the correct values.

```
cat << EOF >> ./db/db_info.php
<?php
\$our_db_host="localhost:3306";
\$our_db_user="$db_username";
\$our_db_password="$db_password";
\$our_db_name="our";
\our_cluster_server="$cluster_server_name";
\our_cluster_username="$rit_username";
\our_cluster_password="$rit_password";
?>
EOF
```


#### Create settings.php  file
```
cat << EOF >> ./www/settings.php
<?php
\$CLIENT_ID = "345";
\$BASE_DIRECTORY = "./"; 
\$UPLOAD_DIRECTORY = "./mosaic_uploads";
\$ARCHIVE_DIRECTORY = "./mosaics";
?>
EOF
```

#### Start web servers 
##### Backend port 5000; Frontend port 3000 

```
./dev.sh

```

Note: if using Windows these commands will not work. instead you must manually create the db_info and settings files and manually insert the contents.

To run on windows simply type 

```
dev.sh

```


#### Populating Database Schema
while in www/
##### Windows
'''
reload_schema.bat
'''
##### Linux/Mac
'''
./reload_schema.sh
'''

### Important files

```
www/bootstrap.php
```

Note: if using Windows these commands will not work. instead you must manually create the db_info and settings files and manually insert the contents.

To run on windows simply type 

```
dev.sh
```
#### Folder Walkthrough
##### React

###### API calls to the php server can be found here
```
./ourepository_react/src/services

```

###### Page routes can be found here
```
./ourepository_react/src/App.js


```

###### Pages and page components can be found here
```
./ourepository_react/src/pages
./ourepository_react/src/components


```


###### TailwindCSS is our css framework, config found here
```
./ourepository_react/tailwind.config.js

```


#### File Structure Notes
##### PHP

###### API routes 
```
./ourepository/www/api_v2.php

```

###### Docrine ORM Entities
```
./ourepository/www/src/

```



