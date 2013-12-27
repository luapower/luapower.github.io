if [ "$OSTYPE" == "msys" ]; then
	cmd //C ..\\bin\\mingw32\\luajit dependencies.lua "$@"
else
	../bin/linux32/luajit dependencies.lua "$@"
fi
