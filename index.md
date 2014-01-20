---
project:  luapower
title:    luapower
tagline:  Lua, JIT, batteries
---

![](luapower.png)

  * Lua libraries and bindings with demos, documentation and separate github repos
  * C libraries with sources, binaries and build scripts for Windows and Linux
  * LuaJIT executable
  * everything free

<div id="package_table" class="package_table"></div>


## The What

A selection of Lua and C libraries chosen for speed, portability, API stability and a free license.
On top of that, a growing collection of ffi bindings and Lua modules
mostly written by me ([capr](https://github.com/capr)).
My code is in public domain (PD) as I do not support the copyright law. The rest is mostly free as-in non-viral.


## Getting started

The fastest route to running code is to download [luajit] and all the packages that you need
and unzip them _over the same directory_ (that's fine and encouraged, there will be no name clashes, see below).
This will give you an instantly portable luajit distro that will work reagardless of where you run it from.

That being said, binaries can also be built from source if desired (see below).

Or you can go the git way with [luapower-git], which gives you package management a la LuaRocks, but git-based.


## Directory Layout

Luapower packages follow strict conventions on where the files are and how they are named:

  * module: `<lib>.lua`
  * submodule: `<lib>_<sub>.lua` and sometimes `<lib>/<sub>.lua`
  * ffi cdef module: `<lib>_h.lua`
  * test program: `<lib>_test.lua`
  * demo: `<lib>_demo.lua`
  * documentation: `<lib>.md`
  * C libs:
    * sources: `csrc/<lib>/*`
    * build scripts: `csrc/<lib>/build-<platform>.sh`
    * binaries: `bin/mingw32/<lib>.dll`, `bin/linux32/lib<lib>.so`
	 * version file: `csrc</lib>/WHAT`
  * LuaJIT executable: `bin/<platform>/luajit`

As a result, downloaded packages can be safely unzipped over the same directory, and package management becomes
easy to automate (see the [luapower command](luapower-git.html#the-luapower-command)).

The included luajit executable looks for Lua modules in `../..` relative to its own dir, so luapower modules
will be found regardless of the directory which luajit is started in.


## Building the C libraries

Building is based on mostly one-liner shell scripts that invoke gcc directly (no makefiles).
Build scripts are provided for each package/platform as `csrc/<package>/build-<platform>.sh`.
C sources are also included so you can start right away. C binary dependencies are not built automatically.
They are however listed in the WHAT file of the package at `csrc/<package>/WHAT`.

CFLAGS and CXXFLAGS env. vars can be set to control the build process.

A fully autmated one-shot build script for all packages is provided in [luapower-git].


### On Windows

Windows dlls were compiled with MinGW GCC 4.7.2 and linked against msvcrt.dll.
Below is the exact list of packages used to make a complete toolchain.
The build scripts assume that both MSys and MinGW bin dirs (in this order) are in your PATH.

----
[binutils-2.23.1-1-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Base/binutils/binutils-2.23.1/binutils-2.23.1-1-mingw32-bin.tar.lzma/download)
[mingwrt-3.20-2-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/mingw-rt/mingwrt-3.20/mingwrt-3.20-2-mingw32-dev.tar.lzma/download)
[mingwrt-3.20-2-mingw32-dll](http://sourceforge.net/projects/mingw/files/MinGW/Base/mingw-rt/mingwrt-3.20/mingwrt-3.20-2-mingw32-dll.tar.lzma/download)
[w32api-3.17-2-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/w32api/w32api-3.17/w32api-3.17-2-mingw32-dev.tar.lzma/)
[mpc-0.8.1-1-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpc/mpc-0.8.1-1/mpc-0.8.1-1-mingw32-dev.tar.lzma/)
[libmpc-0.8.1-1-mingw32-dll-2](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpc/mpc-0.8.1-1/libmpc-0.8.1-1-mingw32-dll-2.tar.lzma/)
[mpfr-2.4.1-1-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpfr/mpfr-2.4.1-1/mpfr-2.4.1-1-mingw32-dev.tar.lzma/)
[libmpfr-2.4.1-1-mingw32-dll-1](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpfr/mpfr-2.4.1-1/libmpfr-2.4.1-1-mingw32-dll-1.tar.lzma/)
[gmp-5.0.1-1-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/gmp/gmp-5.0.1-1/gmp-5.0.1-1-mingw32-dev.tar.lzma/)
[libgmp-5.0.1-1-mingw32-dll-10](http://sourceforge.net/projects/mingw/files/MinGW/Base/gmp/gmp-5.0.1-1/libgmp-5.0.1-1-mingw32-dll-10.tar.lzma/)
[pthreads-w32-2.9.0-mingw32-pre-20110507-2-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/pthreads-w32/pthreads-w32-2.9.0-pre-20110507-2/pthreads-w32-2.9.0-mingw32-pre-20110507-2-dev.tar.lzma/)
[libpthreadgc-2.9.0-mingw32-pre-20110507-2-dll-2](http://sourceforge.net/projects/mingw/files/MinGW/Base/pthreads-w32/pthreads-w32-2.9.0-pre-20110507-2/libpthreadgc-2.9.0-mingw32-pre-20110507-2-dll-2.tar.lzma/)
[libiconv-1.14-2-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/libiconv/libiconv-1.14-2/libiconv-1.14-2-mingw32-dev.tar.lzma/)
[libiconv-1.14-2-mingw32-dll-2](http://sourceforge.net/projects/mingw/files/MinGW/Base/libiconv/libiconv-1.14-2/libiconv-1.14-2-mingw32-dll-2.tar.lzma/)
[libintl-0.18.1.1-2-mingw32-dll-8](http://sourceforge.net/projects/mingw/files/MinGW/Base/gettext/gettext-0.18.1.1-2/libintl-0.18.1.1-2-mingw32-dll-8.tar.lzma/)
[libgomp-4.7.2-1-mingw32-dll-1](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libgomp-4.7.2-1-mingw32-dll-1.tar.lzma/)
[libssp-4.7.2-1-mingw32-dll-0](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libssp-4.7.2-1-mingw32-dll-0.tar.lzma/)
[libquadmath-4.7.2-1-mingw32-dll-0](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libquadmath-4.7.2-1-mingw32-dll-0.tar.lzma/)
[gcc-core-4.7.2-1-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/gcc-core-4.7.2-1-mingw32-bin.tar.lzma/)
[libgcc-4.7.2-1-mingw32-dll-1](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libgcc-4.7.2-1-mingw32-dll-1.tar.lzma/)
[gcc-c++-4.7.2-1-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/gcc-c%2B%2B-4.7.2-1-mingw32-bin.tar.lzma/)
[libstdc++-4.7.2-1-mingw32-dll-6](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libstdc%2B%2B-4.7.2-1-mingw32-dll-6.tar.lzma/)
[make-3.82-5-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Extension/make/make-3.82-mingw32/make-3.82-5-mingw32-bin.tar.lzma/download)
[ragel 6.8 (only for harfbuzz)](http://www.jgoettgens.de/Meine_Bilder_und_Dateien/ragel-vs2012.7z)
----

### On Linux

GCC 4.x should build everything just fine. I used the stock Debian toolchain with no problems.

