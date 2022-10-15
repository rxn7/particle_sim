#!/bin/sh

tsc --project $(pwd)
mkdir -p build
cp static/* build
cp -r dist build