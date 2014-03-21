---
title:    building luapower
tagline:  building the C libraries
---

## What you need to know first

 * Building is based on one-liner shell scripts that invoke gcc directly (no makefiles).
 * Each supported package/platform/arch has a separate build script `csrc/<package>/build-<platf><arch>.sh`.
 * Not all platform/arch combinations are supported for all packages (sort packages by platform to check).
 * C sources are included so you can start right away.
 * Dependent packages are listed in `csrc/<package>/WHAT`. Build those first.
 * For building Lua/C modules you need [lua-headers].
 * For building Lua/C modules for Windows you need [luajit] (for linking to lua51.dll).
 * You will get stripped binaries, with libgcc and libstdc++ statically linked, except on OSX (see below).
 * Windows binaries are linked to msvcrt.dll and Lua/C modules are linked to lua51.dll.
 * Windows builds are compatible down to Windows 2000/XP (32bit and 64bit)
 * OSX builds are compatible down to OSX 10.6 (x86 only, 32bit and 64bit)


## Building on Windows 32bit for Windows 32bit

Use `build-mingw32.sh`.
These scripts assume that both MSys and MinGW bin dirs (in this order) are in your PATH.
Below is the exact list of MinGW packages used to build the current luapower stack:

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
----

Additional tools needed by a few special packages (use them for building for 64bit too):

----
[ragel 6.8 (only for harfbuzz)](http://www.jgoettgens.de/Meine_Bilder_und_Dateien/ragel-vs2012.7z)
[nasm 2.11 (only for libjpeg-turbo)](http://www.nasm.us/pub/nasm/releasebuilds/2.11/win32/nasm-2.11-win32.zip)
[cmake 2.8.12.2 (only for libjpeg-turbo)](http://www.cmake.org/files/v2.8/cmake-2.8.12.2-win32-x86.zip)
----

## Building on Windows 64bit for Windows 64bit

Use `build-mingw64.sh`.
These scripts assume that both MSys and MinGW-w64 bin dirs (in this order) are in your PATH.
Here's the exact MinGW-w64 package used to build the current luapower stack:

----
[mingw-w64 4.8.1 (64bit, posix threads, SEH exception model)][mingw-w64-win64]
----


## Building on Windows 32bit for Windows 64bit

MinGW-w64 can be used to cross-compile C libraries for x86_64 from a 32bit Windows machine. But MinGW-w64 cannot
be used to cross-compile LuaJIT this way because LuaJIT requires SEH for the x86_64 target, and there's no
MinGW-w64 32bit binaries for that.

> Note that in MinGW-w64 terminology, host means target and target means host.

Because of that limitation, this is not a supported host/target cross-compling combination.

If you still want to do it, you can download the [latest toolchain][mingw-w64-win32] from mingwbuilds,
add mingw32/bin in your PATH and build using `build-mingw64-from-win32.sh` where available.

> NOTE: This will build libraries with the SJLJ exception model,
unlike current luapower binaries which use SEH.


## Building on Linux for Linux (x86 native)

Use `build-linux32.sh` on a 32bit host and `build-linux64.sh` on a 64bit host.
Careful not to mix them up, or you'll get 32bit binaries in the 64bit directory or viceversa.

You need a recent gcc toolchain, which you probably already have.

The current luapower stack is built with gcc 4.7.2 from tinycore 5.2 (see below).


## Building on Windows or OSX for Linux (x86 32bit and 64bit)

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


## Building on OSX for OSX (x86 32bit and 64bit)

Use `build-osx32.sh` to make 32bit x86 binaries and `build-osx64.sh` to make 64bit x86 binaries.
Clang is a cross-compiler, so you can build for 32bit on a 64bit OSX and viceversa.

Current OSX builds are based on clang 5.0 (clang-500.2.279) which comes with
Xcode 5.0.2, and are done on a 64bit OSX 10.9.

The generated binaries are compatible down to OSX 10.6 for both 32bit and 64bit.

> NOTE: Clang/OSX doesn't (and will not) support static binding of the standard C++ library nor of libgcc.


[mingw-w64-win64]:    http://sourceforge.net/projects/mingwbuilds/files/host-windows/releases/4.8.1/64-bit/threads-posix/seh/x64-4.8.1-release-posix-seh-rev5.7z
[mingw-w64-win32]:    http://heanet.dl.sourceforge.net/project/mingwbuilds/host-windows/releases/4.8.1/32-bit/threads-posix/sjlj/
[Core-5.2.iso]:       http://distro.ibiblio.org/tinycorelinux/5.x/x86/release/Core-5.2.iso
[CorePure64-5.2.iso]: http://distro.ibiblio.org/tinycorelinux/5.x/x86_64/release/CorePure64-5.2.iso
