---
title:    get involved
tagline:  I want YOU for LUA POWER
---

<div class="bg bg-i-want-you"></div>

The way you add modules to luapower is you make a git repo that resembles a luapower package and send in a pull request.

> Or if that's too formal for you, add an issue, comment, whatever.
Adding modules to luapower should be _easy_.

## Anatomy of a package

You probably got it already if you looked at a few different packages, but let's make it ceremonial.
Here's how you should lay down your files:

  * main module: `foo.lua`
  * submodule: `foo_bar.lua` and sometimes `foo/bar.lua`
  * ffi cdef module: `foo_h.lua`
  * test program: `foo_test.lua`
  * demo: `foo_demo.lua`
  * documentation: `foo.md`
  * C libs & Lua/C libs:
    * sources: `csrc/foo/*`
    * build scripts: `csrc/foo/build-<platform>.sh`
		* platforms: mingw32, mingw64, linux32, linux64, osx32, osx64, android.
    * binaries:
	   * C libraries: `bin/mingw32/foo.dll`, `bin/linux32/libfoo.so`
	   * Lua/C libraries: `bin/<platform>/clib/foo[.dll|.so]`
	 * description: `csrc/foo/WHAT`
  * LuaJIT executable: `bin/<platform>/luajit[.exe]`

The first line of the WHAT file can be parsed if it has the form `"<name> <version> from <browse-url> (<license>)"`.
The second line too, if it says `requires: package1, package2, ...`, which is where you list _binary_ dependencies
(reading the dll dependencies and figuring it out from there is a project for another winter day).
After the first two lines you can type in additional notes, whatever, they aren't parsed.

Your docs should start with the usual yaml header with at least the `package` field defined. You should also include
a `platforms` field for any package that is platform-specific. For packages with a C component just adding
the build scripts is enough to figure out the supported platforms.

These conventions allow packages to be safely unzipped over a common directory, and it makes it possible to extract
package information and build the package database.

If using [luapower-git], the package must be added to the list of known packages by way of an exclude file,
which is a `.gitignore`-type file used for excluding files between packages so that packageA's files don't show
up as untracked in packageB.

> Tip: The luapower command from [luapower-git] can check on some of these conventions
and report inconsistencies. Check it out.

## What to add

It might be that your idea of a good package to add to luapower wildly diverges from mine, in which case I would
politely refuse to add your package to luapower. But here's where you can have your cake and eat it too.

## Fork luapower itself

Luapower is a completely static website hosted on github with a Lua script behind to manage it, plus a few shell
scripts for working with git. Which means that with a few forks and a few tweaks you can have your own luapower
clone with your own modules on it. You won't have to fork the original modules to your account either,
since you can clone packages from multiple remote locations with no problems.

