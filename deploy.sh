#!/bin/sh

set -e

git checkout master

git checkout --orphan gh-pages
git commit -a -m "Build update"


echo "\e[1;32mProject has been successfuly built\e[0m"