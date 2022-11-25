#!/usr/bin/env bash

set -e

npx gh-pages --dist build

echo -e "\e[1;32mProject has been successfuly deployed!\e[0m"