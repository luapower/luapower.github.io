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


## What?

A selection of Lua and C libraries chosen for speed, portability, API stability and a free license.
On top of that, a growing collection of ffi bindings and Lua modules mostly written by me ([capr]).
My code is in public domain (PD) as I do not support the copyright law. The rest is mostly free as-in non-viral.


## Get Started

The fastest route to running code is to download the zip file for [luajit] and other the packages that you are
interested in and unzip them _over the same directory_. This will give you an instantly **portable luajit distro**
that will work reagardless of where you run it from. You will find the luajit executable in `bin/<your-platform>/`,
already configured to look for Lua modules in `../..` (relative to the executable's dir,
not dir you start the executable into). Binaries can then be rebuilt from source if so desired (see below).

Or you can go the git way with [luapower-git], which gives you package management a la LuaRocks, but git-based.
Using this method, you can (among other things) clone all packages in one shot, you can build all C libraries
in one shot, and you can stay current with luapower by just pulling. You can also git-clone the packages yourself
with git and no additional tools, but... read on [luapower-git] before trying that.

> NOTE: some unit tests (`*_test.lua` files) need [unit].

## Directory Layout

Luapower packages follow some conventions on where the files are and how they are named:

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
	 * description: `csrc</lib>/WHAT`
  * LuaJIT executable: `bin/<platform>/luajit`

As a result, packages can be safely unzipped over the same directory, and package management
can be [automated][luapower command].


## Building the C libraries

Building is based on mostly one-liner shell scripts that invoke gcc directly (no makefiles).
Build scripts are provided for each package/platform as `csrc/<package>/build-<platform>.sh`.
C sources are also included so you can start right away. Dependencies are listed in the WHAT file
`csrc/<package>/WHAT` -- you'll have to build those first (for a fully autmated one-shot build script
for all packages, use [luapower-git]).

For compiling Lua/C modules you also need [lua-headers] and, for Windows in particular, `lua51.dll`
must be present at the time of building (that would be [luajit], but you can use the Lua binary too,
they are ABI-compatible).

`CFLAGS` and `CXXFLAGS` env. vars can be used to control `gcc` and `g++` respectively (they're
not set to anything by default, but consider at least `-O2`).


### On Windows

The build scripts for Windows assume that both MSys and MinGW bin dirs (in this order) are in your PATH.

Windows binaries were compiled with MinGW GCC 4.7.2 and linked against msvcrt.dll.

> `CFLAGS` used: `-O2 -s -static-libgcc` (level 2 optimization, stripped binary, embed libc) \
> `CXXFLAGS` used: `-O2 -s -static-libstdc++` (level 2 optimization, stripped binary, embed libstdc++)

Below is the exact list of MinGW packages used to make a complete C/C++ toolchain.

----
[binutils-2.23.1-1-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Base/binutils/binutils-2.23.1/binutils-2.23.1-1-mingw32-bin.tar.lzma)
[mingwrt-3.20-2-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/mingw-rt/mingwrt-3.20/mingwrt-3.20-2-mingw32-dev.tar.lzma)
[mingwrt-3.20-2-mingw32-dll](http://sourceforge.net/projects/mingw/files/MinGW/Base/mingw-rt/mingwrt-3.20/mingwrt-3.20-2-mingw32-dll.tar.lzma)
[w32api-3.17-2-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/w32api/w32api-3.17/w32api-3.17-2-mingw32-dev.tar.lzma)
[mpc-0.8.1-1-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpc/mpc-0.8.1-1/mpc-0.8.1-1-mingw32-dev.tar.lzma)
[libmpc-0.8.1-1-mingw32-dll-2](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpc/mpc-0.8.1-1/libmpc-0.8.1-1-mingw32-dll-2.tar.lzma)
[mpfr-2.4.1-1-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpfr/mpfr-2.4.1-1/mpfr-2.4.1-1-mingw32-dev.tar.lzma)
[libmpfr-2.4.1-1-mingw32-dll-1](http://sourceforge.net/projects/mingw/files/MinGW/Base/mpfr/mpfr-2.4.1-1/libmpfr-2.4.1-1-mingw32-dll-1.tar.lzma)
[gmp-5.0.1-1-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/gmp/gmp-5.0.1-1/gmp-5.0.1-1-mingw32-dev.tar.lzma)
[libgmp-5.0.1-1-mingw32-dll-10](http://sourceforge.net/projects/mingw/files/MinGW/Base/gmp/gmp-5.0.1-1/libgmp-5.0.1-1-mingw32-dll-10.tar.lzma)
[pthreads-w32-2.9.0-mingw32-pre-20110507-2-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/pthreads-w32/pthreads-w32-2.9.0-pre-20110507-2/pthreads-w32-2.9.0-mingw32-pre-20110507-2-dev.tar.lzma)
[libpthreadgc-2.9.0-mingw32-pre-20110507-2-dll-2](http://sourceforge.net/projects/mingw/files/MinGW/Base/pthreads-w32/pthreads-w32-2.9.0-pre-20110507-2/libpthreadgc-2.9.0-mingw32-pre-20110507-2-dll-2.tar.lzma)
[libiconv-1.14-2-mingw32-dev](http://sourceforge.net/projects/mingw/files/MinGW/Base/libiconv/libiconv-1.14-2/libiconv-1.14-2-mingw32-dev.tar.lzma)
[libiconv-1.14-2-mingw32-dll-2](http://sourceforge.net/projects/mingw/files/MinGW/Base/libiconv/libiconv-1.14-2/libiconv-1.14-2-mingw32-dll-2.tar.lzma)
[libintl-0.18.1.1-2-mingw32-dll-8](http://sourceforge.net/projects/mingw/files/MinGW/Base/gettext/gettext-0.18.1.1-2/libintl-0.18.1.1-2-mingw32-dll-8.tar.lzma)
[libgomp-4.7.2-1-mingw32-dll-1](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libgomp-4.7.2-1-mingw32-dll-1.tar.lzma)
[libssp-4.7.2-1-mingw32-dll-0](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libssp-4.7.2-1-mingw32-dll-0.tar.lzma)
[libquadmath-4.7.2-1-mingw32-dll-0](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libquadmath-4.7.2-1-mingw32-dll-0.tar.lzma)
[gcc-core-4.7.2-1-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/gcc-core-4.7.2-1-mingw32-bin.tar.lzma)
[libgcc-4.7.2-1-mingw32-dll-1](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libgcc-4.7.2-1-mingw32-dll-1.tar.lzma)
[gcc-c++-4.7.2-1-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/gcc-c%2B%2B-4.7.2-1-mingw32-bin.tar.lzma)
[libstdc++-4.7.2-1-mingw32-dll-6](http://sourceforge.net/projects/mingw/files/MinGW/Base/gcc/Version4/gcc-4.7.2-1/libstdc%2B%2B-4.7.2-1-mingw32-dll-6.tar.lzma)
[make-3.82-5-mingw32-bin](http://sourceforge.net/projects/mingw/files/MinGW/Extension/make/make-3.82-mingw32/make-3.82-5-mingw32-bin.tar.lzma)
[ragel 6.8 (only for harfbuzz)](http://www.jgoettgens.de/Meine_Bilder_und_Dateien/ragel-vs2012.7z)
----


### On Linux

GCC 4.4.5 was used (stock Debian 6 gcc toolchain + nasm and ragel) with the same CFLAGS and CXXFLAGS as above.


[capr]:              https://github.com/capr
[luapower command]:  luapower-git.html#the-luapower-command
[unit]:              https://github.com/luapower/unit

