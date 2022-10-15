#!/usr/bin/env bash

set -e

tsc --project $(pwd)
mkdir -p build
cp static/* build
cp -r dist build

echo "\e[1;32mProject has been successfuly built!\e[0m"