#!/bin/bash
echo 1 > /tmp/compilation_Neuronal_in_progress
sudo apt-get install -y --force-yes libfann-dev cmake
echo 10 > /tmp/compilation_Neuronal_in_progress
git clone https://github.com/libfann/fann.git
cd ./fann
cmake
sudo make install
echo 90 > /tmp/compilation_Neuronal_in_progress
if grep -q "extension=fann.so" /etc/php5/apache2/php.ini  then
    echo "L'extention fann.so est présent";
else
  sudo echo "extension=fann.so" >> /etc/php5/apache2/php.ini;
fi
echo 100 > /tmp/compilation_Neuronal_in_progress
rm /tmp/compilation_Neuronal_in_progress
