---
title:    building luapower
tagline:  building the C libraries
---

## Overview

Building is based on one-liner shell scripts that invoke gcc directly (no makefiles).
Each package has a separate script in its `csrc` dir, for each supported platform.
C sources are also included in the package so you can start right away.
Dependencies are listed in the `WHAT` file -- download and build them first.

For compiling Lua/C modules you also need [lua-headers] and, for Windows in particular, lua51.dll
must be available at the time of building, so you'll need [luajit] too.

The build scripts will build `-O2`-optimized, stripped binaries with static linking of libgcc and libstdc++.

## Building on Windows for Windows (32bit)

The build scripts for Windows assume that both MSys and MinGW bin dirs (in this order) are in your PATH.

Windows binaries were compiled with MinGW GCC 4.7.2 and linked against msvcrt.dll.

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

> Don't use GCC 4.8 to build luajit. And with all due respect, don't bug me about build scripts not working
if you're using a different toolchain. I don't like building things any more than anyone with a soul does.

## Building on Windows for Windows (64bit)

Stay tuned.

## Building on Linux for Linux (32bit and 64bit)

You probably have gcc and make installed already. If you have GCC 4.7+ that's even better.
Just run the appropriate build scripts for your architecture (32bit or 64bit).

## Building on Windows for Linux (32bit and 64bit)

If you are on Windows and you want to compile for Linux and don't want to mess with a cross-compiler,
here is a quick method to build binaries for Linux from a Windows environment.

* Grab VirtualBox
* Grab TinyCore
	* 32bit: [Core-5.2.iso] (10 MB!)
	* 64bit: [CorePure64-5.2.iso] (10 MB!)
* Make a VM, set up like this:
	* give it 512M RAM or more
	* add a network card for Internet access
	* a disk is not necessary, tinycore runs entirely from RAM, if you have enough
	* enable PAE under System -> Processor
	* enable VT-x and Nested Paging under System -> Acceleration (if your CPU supports it)
		* if you are on a 32bit Windows and you want to run a 64bit Linux, your CPU _must_ have hardware acceleration
* Boot it up
* Get gear (git and toolchain)
	* `$ tce-load -wi git compiletc`
* Get luapower
	* `$ git clone https://github.com/luapower/luapower-git luapower`
	* `$ cd luapower`
* Get all luapower packages
	* `$ ./clone.sh --all`
* Build all luapower packages (it will only build for your platform, either 32bit or 64bit)
	* `$ cd csrc`
	* `$ ./build.sh --all`
* Or, get and compile packages individually
	* `$ ./clone.sh --list`
	* `$ ./clone.sh foobar`
	* `$ cd csrc/foobar`
	* `$ ./build-linux32.sh` or `./build-linux64.sh` depending on what ISO you used

## Building on OSX for OSX (64bit)

Stay tuned.


[lua-headers]:        https://github.com/luapower/lua-headers
[Core-5.2.iso]:       http://distro.ibiblio.org/tinycorelinux/5.x/x86/release/Core-5.2.iso
[CorePure64-5.2.iso]: http://distro.ibiblio.org/tinycorelinux/5.x/x86_64/release/CorePure64-5.2.iso
