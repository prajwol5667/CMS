#!/bin/bash
echo "Creating image"
if [ $# -ne 1 ];
    then echo "illegal number of parameters"
    exit 1
fi

BUILD_NUM=$1
echo "Running with BUILD_NUM=" $BUILD_NUM
docker build -t prajwol5667/cms:$BUILD_NUM .

if [  "$(docker ps -q -f name=t1)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=t1)" ]; then
       echo "cleanup"
        docker stop t1
        docker rm t1
    fi
    echo "run your container"
    docker run -d --name t1  --rm -p 8099:8080 prajwol5667/cms:$BUILD_NUM
fi

