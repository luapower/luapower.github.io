---
title:    building luapower
tagline:  building the C libraries
---

## Overview

Building is based on one-liner shell scripts that invoke gcc directly (no makefiles).
Each package has a separate build script in its `csrc` dir, for each supported platform/architecture.
C sources are also included in the package so you can start right away.
Dependent packages are listed in the `WHAT` file -- download and build them first.

For compiling Lua/C modules you also need [lua-headers] and, for Windows in particular, lua51.dll
must be available at the time of building, so you'll need the [luajit] package too.

> The build scripts will build `-O2`-optimized, stripped binaries, with libgcc and libstdc++ statically linked,
except on OSX.

## Building on Windows 32bit for Windows 32bit

The build scripts for Windows assume that both MSys and MinGW bin dirs (in this order) are in your PATH.

Windows binaries are compiled with MinGW GCC 4.7.2 and linked against msvcrt.dll.

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

## Building on Windows 64bit for Windows 64bit

Stay tuned.

## Building on Windows 32bit for Windows 64bit

MinGW-w64 can be used to cross-compile C libraries for x86_64 from a 32bit Windows machine. But MinGW-w64 cannot
be used to cross-compile LuaJIT this way because LuaJIT requires SEH for the x86_64 target, and there's no
MinGW-w64 32bit binaries for that.

> NOTE: In MinGW-w64 terminology, host means target and target means host.

Because of that limitation, this is not a supported host/target combination and build scripts
are not provided for this scenario.

If you still want to do it, you can download the latest toolchain from [mingwbuilds] (threads-posix/sjlj preferred),
add mingw32/bin in your PATH, and make new build scripts based on the mingw32 build scripts,
replacing `gcc` with `i686-w64-mingw32-gcc -m64` and `../../bin/mingw32` with `../../bin/mingw64`.

## Building on Linux for Linux (native)

You probably have gcc and make installed already. If you have GCC 4.7+ that's even better.
Just run the appropriate build scripts for your architecture (32bit or 64bit).

## Building on Windows or OSX for Linux (32bit and 64bit)

If you are on Windows or OSX and you want to compile for Linux and don't want to mess with a cross-compiler,
here is a quick method to build Linux binaries from a Windows or OSX (or even Linux) environment.

* Grab VirtualBox
* Grab TinyCore
	* 32bit: [Core-5.2.iso] (10 MB!)
	* 64bit: [CorePure64-5.2.iso] (10 MB!)
* Make a VM, set up like this:
	* give it 512M RAM or more
	* add a network card with Internet access
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
	* `$ ./build-linux32.sh` or `./build-linux64.sh`, depending on what ISO you used

## Building on OSX for OSX (x86 64bit)

OSX builds are currently only compatible with OSX 10.9.

Install Xcode 5.0.2 which will get you clang 5.0 (clang-500.2.279).

There are a few problems with building with the Xcode-supplied compiler:

  * you need to sign up with your Apple ID to get Xcode
  * clang doesn't support static building of the standard C++ library nor of libgcc.

For these reasons, I am tempted to switch to GCC 4.7 from MacPorts.
Support for OSX 10.6+ (32bit and 64bit) is also considered (this would require finding and downloading the 10.6 SDK).
Feedback welcome.


[mingwbuilds]:        http://heanet.dl.sourceforge.net/project/mingwbuilds/host-windows/releases/
[Core-5.2.iso]:       http://distro.ibiblio.org/tinycorelinux/5.x/x86/release/Core-5.2.iso
[CorePure64-5.2.iso]: http://distro.ibiblio.org/tinycorelinux/5.x/x86_64/release/CorePure64-5.2.iso
