#!/bin/sh
[ "$OSTYPE" == "msys" ] && platform=mingw32 || platform=linux32
"$(dirname "$0")/../bin/$platform/luajit" "$@"
