---
title:    get involved
tagline:  I want YOU for LUA POWER
---

> NOTE: This page is all about rules, so necessarily you will have issues with it.
Whether or not you agree with the decisions taken, please note that _some_ conventions
had to be created in order to achieve specific benefits, and that's the only reason
for creating them. I respect the fact everybody has his/hers own rules and work flow and
coding style, which can only accidentally coincide with mine, and I'd rather support individual
freedom than enforce popular convention. Please have this in mind when reading upon these rules,
and remember that they are always open for improvement. Feedback is welcome and appreciated.

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
		* platforms are named mingw32, mingw64, linux32, linux64, osx32, osx64.
    * binaries (resulted from building):
	   * C libraries: `bin/mingw32/foo.dll`, `bin/linux32/libfoo.so`
	   * Lua/C libraries: `bin/<platform>/clib/foo[.dll|.so]`
	 * description: `csrc/foo/WHAT` (see below)
  * exclude file: `foo.exclude` (see below)
  * LuaJIT executable: `bin/<platform>/luajit[.exe]`

> These conventions allow packages to be safely unzipped over a common directory and the result look sane,
and it makes it possible to extract package information and build the package database.

### The Docs

In order to appear on the website, docs should start with a yaml header:

	---
	project: cairo
	tagline: cairo graphics engine
	---

  * the `project` field should match the git project's name - this makes the "view on github" and download buttons appear.
  * `platforms: platform1, ...` should be added for Lua packages that are platform-specific
  but don't have a C component (eg. [winapi]; for packages with a C component, adding the build scripts is enough
  to figure out the supported platforms).
  * a good, short tagline is important for figuring out what the module does when browsing the module list

You don't have to make a doc for each submodule if you don't have much to document for it, a single doc
matching the package name would suffice.

### The `WHAT` file

The WHAT file is used for packages that have a C component (Lua+ffi, Lua/C or C packages),
and it's used to describe that C component. Pure Lua packages don't need a WHAT file.

	cairo 1.12.16 from http://cairographics.org/releases/ (LGPL license)
	requires: pixman, freetype, zlib, libpng

  * the first line should read `<name> <version> from <browse-url> (<license>)`
  * the second line should read `requires: package1, package2, ...` and it is only needed if the package has
  any binary dependencies.
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
  * adding a comment on top of the `foo_h.lua` file describing the origin (which files? which version?)
  and process (cpp? by hand?) used for generating the file adds confidence that the C API is complete and updated.
  * calling `ffi.load()` without paths, custom names or version numbers keeps the module away from any decision regarding
  how and where the library is to be found, which in turn this allows for more freedom on how to deploy libraries.
  * the reason for putting cdefs in a separate file is because they may contain types that other packages might need.
  If this is an unlikely scenario and the API is small, you can embed the cdefs in the main module file directly.
  * (subjective) I don't use `module()` to keep _G clean. For big modules with a shared namespace I make
  a "namespace" module and use `setfenv(1, require'foo.ns')` as the first line of every submodule (see [winapi]).
  * (subjective) my code is indented with tabs, and alignment inside the line is done with spaces,
  because I think that a fixed tabsize should not be enforced on people (plus very few editors can jump
  through space indentation).
  * (subjective) I use Lua's naming conventions `foo_bar` and `foobar` instead of FooBar or fooBar.


### The Build Scripts

Write a build script for each supported platform. Ideally, your build script is a gcc (or g++) one-liner
like most build scripts around here. Writing gcc one-liners is easy for most C libraries. You only have to remember
a few important gcc switches:

  * `-shared`							: create a shared library
  * `-o <output-file>`				: output file path (eg. `-o ../../bin/mingw32/z.dll`)
  * `-I<dir>`							: search path for headers (eg. `-I../lua`)
  * `-L<dir>`							: search path for library dependencies (eg. `-L../../bin/mingw32`)
  * `-l<libname>`						: dynamic library dependency (eg. `-lz` looks for `z.dll`, `libz.so` or `libz.dylib` depending on platform)
  * `-O2`								: enable code optimizations
  * `-s`									: strip debug symbols (makes the binaries smaller and debuggers useless; not for OSX)
  * `-static-libstdc++`				: static linking of the C++ standard library (for g++; not for OSX)
  * `-static-libgcc`					: static linking of the GCC library (for gcc and g++; not for OSX)
  * `-D<name>`							: set a `#define`
  * `-D<name>=<value>`				: set a `#define`
  * `-pthread`							: enable pthread support (not for Windows)
  * `-fpic`								: PIC mode (required for 64bit targets)
  * `-DWINVER=0x501`             : set windows.h API level to Windows XP
  * `-DWINVER=0x502`             : set windows.h API level to Windows XP SP2
  * `-DWINVER=0x601`             : set windows.h API level to Windows 7
  * `-DWINVER=0x602`             : set windows.h API level to Windows 8
  * `-undefined dynamic_lookup`  : required for Lua/C modules on OSX (don't link them to luajit!)
  * `-arch i386`                 : OSX: create 32bit x86 binaries
  * `-arch x86_64`               : OSX: create 64bit x86 binaries
  * `-mmacosx-version-min=10.6`  : for C++ modules on OSX: link to libstdc++.6 instead of the newer libc++.1

> __IMPORTANT__: place the `-L` and `-l` switches ___after___ the input files!

#### Example (compile lpeg 0.10 for linux32):

	gcc -O2 -s -static-libgcc lpeg.c -shared -o ../../bin/linux32/clib/lpeg.so -I. -I../lua

In some cases it's going to be more complicated than that.

  * sometimes you won't get away with `*.c` -- some libraries rely on the makefile to choose the C files
  that need to be compiled for a specific platform or set of options (eg. [socket])
  * some libraries actually use one or two of the myriad of defines generated by the `./configure` script
  -- you might have to grep for those and add more `-D` switches to the command line.
  * some libraries have parts written in assembler or other language, in which case you will have to
  do compilation and linking in separate steps. At that point, a (simple) makefile becomes a good alternative.
  If the package has a good makefile that doesn't add more dependencies to the toolchain, use that.

Bigger and more configurable libraries will need more options for sure, and some libraries rely on the
build system to make decisions for them. But even large libraries like [cairo] can be build with simple
shell scripts without compromising on clarity or flexibility.

### Binaries

Ideally, you would build and test your build scripts against the standard luapower [building] environments.
Do not introduce additional tool requirements if you can avoid it.

## Publishing

### 1. Publishing on luapower.com

The way you add modules to luapower.com is:

  * first you make a git repo that resembles a luapower package
  * then you can either:
	 * publish it on your server or github account (luapower users will clone from that url directly)
	   * I will add your package to the package database
		* I will periodically pull and update luapower.com
	 * publish it _and manage it_ yourself on luapower.com
	   * I will add you as an admin to the luapower github account (it's an organization account)
		* you will update luapower.com yourself

#### What to add

Before publishing a luapower module, please consider:

  * what name you plan to use for your module
  * how your module relates to other modules

Choosing a good name is important if you want people to find your module on luapower.com
and understand (from the name alone) what it does. Likewise, it's a good idea to be sure that your module
is doing something new or at least different (and hopefully better) than something already on luapower.com.

Ideally, your module has:

  * __distinction__ - focused problem domain
  * __completeness__ - exhaustive of the problem domain
  * __API documentation__ - so it can be integrated into luapower.com
  * __test and/or demo__ - so it can be seen to work
  * __a non-viral license__ - so it doesn't impose restrictions on _other_ modules

Of course, few modules (in any language) qualify on all fronts, so luapower.com is inevitably an ecclectic mix.
In any case, if your module collection is too specialized to be added to luapower.com or you simply don't
want to mix it in, here's where you can have your cake and eat it too.

### 2. Forking luapower.com

Luapower can be easily forked and used as a personal website for publishing luapower modules.

Luapower is composed of:

  * a [static website][luapower-website] generated with pandoc templating
  * a [Lua script][luapower-command] for updating the package database, navigation tree, and dependency lists offline
  * a few [simple shell scripts][luapower-git-src] for working with git in a shared-work-tree environment

Which means that with a few forks and a few tweaks you can have your own luapower clone with your own modules on it.
The only dependency is [pandoc] for generating the website.

#### The `luapower` command

This is a powerful command that extracts and aggregates data from the luapower environment and gives
detailed information about packages, modules and documentation. It can give accurate information about dependencies
between modules and packages because it actually loads the module and tracks `require` calls, and then it
integrates that information with the information about packages.

It is also used for generating the package database on luapower.com, along with the the dependency lists
you see on each module's page.

The `luapower` command is a Lua script that depends on [luajit], [lfs], [glue] and [tuple] so let's clone these first:

	> clone luajit
	> clone lfs
	> clone glue
	> clone tuple

For updating the website, we also need to clone its files in the `_site` sub-directory:

	> git clone https://github.com/luapower/luapower.github.io _site

The rest you can learn from the tool itself:

	> luapower

	USAGE: luapower <command> ...

	HELP

		help                           this screen

	PACKAGES

		packages                       list installed packages
		known                          list all known package
		left                           list not yet installed packages

	PACKAGE INFO

		describe <package>             describe a package
		type [package]                 package type
		ver [package]                  current git version
		tags [package]                 git tags
		tag [package]                  current git tag
		files [package]                tracked files
		docs [package]                 docs
		modules [package]              modules
		scripts [package]              scripts
		mtree [package]                module tree
		mtags [package [module]]       module info
		platforms [package]            supported platforms
		ctags [package]                C package info

	CHECKS

		check [package]                consistency checks
		trackable                      trackable files
		multitracked                   files tracked by multiple packages
		untracked                      files not tracked by any package

	DATABASE

		update-db [package]            update _site/packages.json
		update-toc [package]           update _site/toc.md
		update [package]               update both _site/packages.json and _site/toc.md
		rebuild-db                     rebuild _site/packages.json

	DEPENDENCIES

		requires <module>              direct module requires
		rall <module>                  direct and indirect module requires
		rtree <module>                 module require log tree
		rext <module>                  direct-external module requires
		pall <module>                  direct and indirect package dependencies
		pext <module>                  direct-external package dependencies
		ppall [package]                direct and indirect package dependencies
		ppext [package]                direct-external package dependencies
		cdeps [package]                direct and indirect C dependencies
		rrev <module>                  all modules that require a module

	The `package` arg defaults to the env var PROJECT, as set by the `proj` command,
	and if that is not set, it defaults to `--all`, meaning all packages.


#### The luapower website

Look into `_site/config.js` for what needs to be adjusted.


[luapower-website]:   https://github.com/luapower/luapower.github.io
[luapower-command]:   https://github.com/luapower/luapower-git/blob/master/luapower.lua
[luapower-git-src]:   https://github.com/luapower/luapower-git
[pandoc]:             http://johnmacfarlane.net/pandoc/
