#!/bin/bash
INSTALL_DIR=/usr/local/bin
FANN_bin=$INSTALL_DIR/fann
TEMP_DIR=`mktemp -d /tmp/fann.XXXXXX`
cd $TEMP_DIR
touch /tmp/compilation_eibd_in_progress
echo 1 > /tmp/compilation_Neuronal_in_progress
sudo apt-get install -y --force-yes libfann-dev cmake
echo 10 > /tmp/compilation_Neuronal_in_progress
git clone https://github.com/libfann/fann.git
echo 20 > /tmp/compilation_Neuronal_in_progress
cd ./fann
cmake .
echo 50 > /tmp/compilation_Neuronal_in_progress
sudo make install
echo 90 > /tmp/compilation_Neuronal_in_progress
if grep -q "extension=fann.so" /etc/php5/apache2/php.ini ; then
    echo "L'extention fann.so est présent"
else
  sudo echo "extension=fann.so" >> /etc/php5/apache2/php.ini
fi
echo 100 > /tmp/compilation_Neuronal_in_progress
rm /tmp/compilation_Neuronal_in_progress
