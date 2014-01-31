---
title:    get involved
tagline:  I want YOU for LUA POWER
---

<div class="bg bg-i-want-you"></div>

## Anatomy of a package

### The Layout

  * main module: `foo.lua`
  * submodule: `foo_bar.lua` and if you really have to, `foo/bar.lua`
  * ffi cdef module: `foo_h.lua` (ok to embed cdefs in `foo.lua` for small APIs)
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

  * the `project` field should match the git project's name (makes the github buttons appear).
  * `platforms: platform1, ...` should be added for Lua packages that are platform-specific
  but don't have a C component (eg. [winapi]; for packages with a C component, adding the build scripts is enough
  to figure out the supported platforms).

### The `WHAT` file

The WHAT file is only used for packages that have a C component (Lua+ffi, Lua/C or C packages),
and it's used to describe that C component.

  * the first line should read `<name> <version> from <browse-url> (<license>)`
  * the second line should read `requires: package1, package2, ...` and it is only needed if the package
  has any _binary_ dependencies which are not also Lua dependencies (eg. [cairo] needs [pixman] this way).
  * after the first two lines and an empty line, you can type in additional notes, whatever, they aren't parsed.

> Extracting dependencies from the dll itself and figuring it out from there is a project for another day.

### The exclude file

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
  * no `module()` if you can help it (some people can't)
  * use `ffi.load()` without paths, custom names or version (let the OS find the lib; the only compatible version
  is that which you tested the binding against and you included in the package)

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

### What to add

Ideally, your lib has:

  * __distinction__ - focused problem domain
  * __completeness__ - exhaustive of the problem domain
  * __API documentation__ - so it can be integrated into the website
  * __test and/or demo__ - so it can be seen to work
  * __a non-viral license__ - so it doesn't impose restrictions on _other_ modules

Ideally, your lib is not:

  * a __glue library__ - lack of focus (by design)
  * a __language abstraction library__ - except DSLs (discuss)
  * a __lowest common denominator library__ - unless direct access to the backends is included too
  * an __alternative take__ on another binding in the database (one should win)

> It might be that your idea of a good package to add to luapower diverges too much from mine, in which case I would
politely refuse to add your package to luapower. But here's where you can have your cake and eat it too.

### 2. Forking luapower.com

Luapower can be used as web _software_ for publishing Lua modules.

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
