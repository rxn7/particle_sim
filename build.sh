#!/usr/bin/env bash

set -e

npx tsc --project $(pwd)
mkdir -p build
cp static/* build
cp -r dist build

echo -e "\e[1;32mProject has been successfuly built!\e[0m"