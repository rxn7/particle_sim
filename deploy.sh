#!/bin/sh

set -e

npx -y -p gh-pages@3.0.0 gh-pages -d build

echo "\e[1;32mProject has been successfuly deployed!\e[0m"