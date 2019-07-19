#!/usr/bin/env bash
#docker私服
DOCKER_HUB=192.168.1.138:5000
#docker集群主机
SWARM_MASTER_DOCKERHOST=192.168.1.35:2375
#环境变量名称
INPUT_SB_ENVNAME=env
#环境变量值
INPUT_SB_ENV=dev

if [ ! -z "$1" -a "-1" != "$1" ];then
    SWARM_MASTER_DOCKERHOST=$1
fi
if [ ! -z "$2" -a "-1" != "$2"  ];then
    DOCKER_HUB=$2
fi
if [ ! -z "$3" ];then
    INPUT_SB_ENV=$3
fi
#项目作用域
PROJECT_SCOPE=eos
#项目名称 对应artifactId
PROJECT_NAME=gvt-eos-mobile-frontend-v1
#镜像版本
PROJECT_VERSION=latest
#版本后缀，没有置空
PROJECT_VERSION_SUFFIX=
#对外开放端口，多个端口注意使用(8080 9090)空格隔开，不要使用[[[,]]]
PROJECT_PORT=881:80
#网络名称
NETWORK_NAME=gvt_network
#运行节点label nodeName对应值
RUN_NODE=
#镜像名称
IMAGE_NAME=${PROJECT_SCOPE}/${PROJECT_NAME}
#打包镜像名称和标记
IMAGE_REPOSITORY=${IMAGE_NAME}:${INPUT_SB_ENV}-${PROJECT_VERSION}

#发布到docker的服务名称
SERVICE_NAME=${PROJECT_NAME}
#节点个数
SERVICE_REPLICAS=1
#其他docker运行参数
DOCKER_ARGS="--limit-cpu 2 --limit-memory 1.8G"
