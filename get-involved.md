---
title:    get involved
tagline:  I want YOU for LUA POWER
---

> NOTE: This page is all about rules, so necessarily you will have issues with it.
But whether or not you agree with the decisions taken, please recognize that
_some_ decisions had to be taken, and _some_ conventions had to be created,
in order to achieve specific benefits, and that's the only reason for creating
these conventions. I fully recognize and respect the fact everybody has his/hers
own rules and work flow and coding style, which can only accidentally coincide with mine,
and I'd rather support individual freedom than enforce popular convention.
Please have this in mind when reading upon these rules, and remember that they
are open for evaluation and improvement. As always, feedback is welcome and appreciated.

## Anatomy of a package

There are 5 types of luapower packages:

  * __Lua module__: written in Lua, compatible with LuaJIT2, Lua 5.1 and optionally Lua 5.2
  * __Lua/C module__: written in C using the Lua C API, compatible with LuaJIT2, Lua 5.1 and optionally Lua 5.2
  * __Lua+ffi module__: written in Lua using the LuaJIT ffi extension, compatible with LuaJIT2
  and optionally with Lua ffi; the C library it binds to is included in the package in source and binary form
  * __C module__: binary dependency or support library for other module; source and binary included
  * __other__: none of the above: media/support files, etc.

### The Layout

  * main module: `foo.lua`
  * submodule: `foo_bar.lua` but `foo/bar.lua` is fine too
  * ffi cdef module: `foo_h.lua`
  * test program: `foo_test.lua`
  * demo: `foo_demo.lua`
  * documentation: `foo.md`, `foo_bar.md` (pandoc markdown)
  * C libs & Lua/C libs:
    * sources: `csrc/foo/*`
    * build scripts: `csrc/foo/build-<platform>.sh`
		* platforms are named mingw32, mingw64, linux32, linux64, osx32, osx64, android.
    * binaries (resulted from building):
	   * C libraries: `bin/mingw32/foo.dll`, `bin/linux32/libfoo.so`
	   * Lua/C libraries: `bin/<platform>/clib/foo[.dll|.so]`
	 * description: `csrc/foo/WHAT` (see below)
  * exclude file: `foo.exclude` (see below)
  * LuaJIT executable: `bin/<platform>/luajit[.exe]`

> These conventions allow packages to be safely unzipped over a common directory and the result look sane,
and it makes it possible to extract package information and build the package database.

### The Docs

Docs should start with a yaml header:

	---
	project: spheroboom
	tagline: defeats scammers
	---

  * the `project` field should match the git project's name (if you want the github buttons to appear).
  * `platforms: platform1, ...` should be added for Lua packages that are platform-specific
  but don't have a C component (eg. [winapi]; for packages with a C component, adding the build scripts is enough
  to figure out the supported platforms).
  * a good, short tagline is important for figuring out what the module does when browsing the module list

You don't have to make a doc for each submodule if you don't have much to document for it.

### The `WHAT` file

The WHAT file is used for packages that have a C component (Lua+ffi, Lua/C or C packages),
and it's used to describe that C component.

  * the first line should read `<name> <version> from <browse-url> (<license>)`
  * the second line should read `requires: package1, package2, ...` and it is only needed if the package
  has any _binary_ dependencies which are not also Lua dependencies (eg. [cairo] needs [pixman] this way).
  * after the first two lines and an empty line, you can type in additional notes, whatever, they aren't parsed.

The WHAT file can also be used to describe Lua modules that are developed outside of luapower (eg. [lexer]).

> Extracting dependencies from the dll itself and figuring it out from there is a project for another day.

### The `exclude` file

This is the .gitignore file used for excluding files between packages so that files in one packages don't show
as untracked files in other package. Another way to think of it is the file used for reserving name-space in the
luapower directory layout.

Example:

	*                    ; exclude all files
	!/foo*               ; include files in root that start with `foo`
	!/foo/               ; include the directory in root named `foo`
	!/foo/**             ; include the contents of the directory named `foo`, recursively

> NOTE: Double-asterisk patterns are Git 1.8.2+.

### The Code

  * adding at least a small comment on the first line of every Lua file with a short tagline (what the module does),
  author and license can be a huge barrier-remover towards approaching your code (adding a full-screen of legal
  crap on the other hand is just bad taste - IMHO).
  * adding a comment on top of the `foo_h.lua` file describing the origin (which files? which version???)
  and process (cpp? by hand?) used for generating the file adds confidence that the C API is complete and updated.
  * I don't use `module()`, but if that's what you like, that's fine.
  * my code is indented with tabs, and alignmenment inside the line is done with spaces,
  in recognition of the fact that tabsize is a personal preference and it should not be enforced upon people.
  * I use `foo_bar` instead of FooBar or fooBar.
  * use `ffi.load()` without paths, custom names or version (let the OS find the library: this allows more
  freedom on how to deploy libraries; the only compatible version is that which you tested the binding against
  and you included in the package)
  * the reason for putting cdefs in a separate file is because they could potentially be used
separately from the Lua binding or may contain types that other cdef modules need.
  * it's ok to embed cdefs in the main module for small APIs

### The Build Scripts

Write a build script for each supported platform. Ideally, your build script is a gcc one-liner
like most build scripts around here. Writing gcc one-liners is quite easy for most C libraries.
You only have to remember a few important gcc switches:

  * `-I<dir>`							: search path for headers
  * `-l<libname>`						: dynamic library dependency (without the `lib` prefix)
  * `-L<dir>`							: search path for library dependencies
  * `-static-libstdc++`				: static linking of the C++ standard library (so that it doesn't become a runtime dependency)
  * `-static-libgcc`					: static linking of the GCC library (so that it doesn't become a runtime dependency)
  * `-O2`								: enable code optimization
  * `-s`									: strip debug symbols (makes the binary smaller)
  * `-D<name>`							: set a `#define`
  * `-D<name>=<value>`				: set a `#define`
  * `-pthread`							: enable pthread support (Linux only)
  * `-fpic`								: PIC mode (required for 64bit)

#### Example (compile lpeg for linux32):

	gcc -O2 -s -static-libgcc lpeg.c -shared -o ../../bin/linux32/clib/lpeg.so -I. -I../lua -ansi -DNDEBUG

In some cases it's going to be more complicated than that.

  * sometimes you won't get away with `*.c` -- some libraries rely on the makefile to choose the C files
  that need to be compiled for a specific platform or set of options (eg. [socket])
  * some libraries actually use one or two of the myriad of defines generated by the `./configure` script
  -- you might have to grep for those and add more `-D` switches to the command line.
  * some libraries have parts written in assembler or other language, in which case you will have to
  do compilation and linking in separate steps. At that point, a (simple) makefile becomes a good alternative.

Bigger and more configurable libraries will need more options for sure, and some libraries rely on the
build system to make too many decisions. But even large libraries like [cairo] can be build with simple
shell scripts without compromising on clarity or flexibility.

### Binaries

Ideally, you would test your build scripts against the standard luapower [building] environments.
Spare luapower users for having to add another tool to their toolchain.

## Publishing

### 1. Publishing on luapower.com

The way you add modules to luapower.com is:

  * first you make a git repo that resembles a luapower package
  * then you can either:
	 * publish it under your github account (luapower users will clone from your account directly)
	   * ask me to add it to the package database
		* I'll periodically pull and update the website
	 * publish it _and manage it_ yourself under the luapower github account (it's an org account)
	   * ask me to add you as an admin
		* you will periodically push and update the website

#### What to add

Before publishing a luapower module, please carefully consider:

  * what name you plan to use for your module
  * how your module relates to other modules

Choosing a good name is important if you want people to find your module on luapower
and understand (from the name alone) what it does. Likewise, it's a good idea to be sure that your module
is doing something new or at least different (and hopefully better) than something already on luapower.

Ideally, your module has:

  * __distinction__ - focused problem domain
  * __completeness__ - exhaustive of the problem domain
  * __API documentation__ - so it can be integrated into luapower.com
  * __test and/or demo__ - so it can be seen to work
  * __a non-viral license__ - so it doesn't impose restrictions on _other_ modules

> It might be that your idea of a good package to add to luapower diverges too much from these criteria,
in which case I would politely refuse to add your package to luapower.
But here's where you can have your cake and eat it too.

### 2. Forking luapower.com

Luapower can be easily forked and used as a personal website for publishing Lua modules.

Luapower is composed of:

  * a [static website][luapower-website] generated with pandoc templating
  * a [Lua script][luapower.lua] for updating the package database, navigation tree, and dependency lists offline
  * a few [simple shell scripts][luapower-git-src] for working with git in a shared-work-tree environment

Which means that with a few forks and a few tweaks you can have your own luapower
clone with your own modules on it. I'll write a section on how to configure a luapower clone
if there's interest in the idea.


[luapower-website]: https://github.com/luapower/luapower.github.io
[luapower.lua]:     https://github.com/luapower/luapower-git/blob/master/luapower.lua
[luapower-git-src]: https://github.com/luapower/luapower-git
