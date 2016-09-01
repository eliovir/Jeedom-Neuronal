#!/bin/bash
echo 1 > /tmp/compilation_Neuronal_in_progress
sudo apt-get install -y --force-yes libfann-dev 
echo 45 > /tmp/compilation_Neuronal_in_progress
sudo pecl install g++
echo 70 > /tmp/compilation_Neuronal_in_progress
sudo pecl install fann
echo 90 > /tmp/compilation_Neuronal_in_progress
if grep -q "extension=fann.so" /etc/php5/apache2/php.ini  then
    echo "L'extention fann.so est présent";
else
  sudo echo "extension=fann.so" >> /etc/php5/apache2/php.ini;
fi
echo 100 > /tmp/compilation_Neuronal_in_progress
rm /tmp/compilation_Neuronal_in_progress
