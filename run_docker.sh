#!/bin/bash
echo "Creating image"
if [ $# -ne 1 ];
    then echo "illegal number of parameters"
    exit 1
fi

BUILD_NUM=$1
echo "Running with BUILD_NUM=" $BUILD_NUM
docker build -t prajwol5667/cms:$BUILD_NUM .

if["$(docker ps -q -f name=t1)"]
then
echo "Exists"

else

echo "Not Exists"

fi 

