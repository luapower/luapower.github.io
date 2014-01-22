---
title:    luapower
tagline:  Lua, JIT, batteries
---

![](luapower.png)

  * portable LuaJIT binary & source distribution
  with demos, documentation, and separate github projects
  * Lua and C libraries with sources, binaries and build scripts for Windows and Linux
  * everything free

<div class="pd-logo"></div>
<div id="package_table" class="package_table"></div>
<div style="width: 100%; text-align: right; font-size: 80%">manifest file: [Lua](packages.lua) | [JSON](packages.json)</div>

## What?

A selection of Lua and C libraries chosen for speed, portability, API stability and a free license.
On top of that, a growing collection of ffi bindings and Lua modules mostly written by me ([capr]).
My code is in public domain (PD) as I do not support the copyright law. The rest is mostly free as-in non-viral.


## Get Started

The fastest route to running code is to download the zip file for [luajit] and other the packages that you are
interested in and unzip them _over the same directory_. This will give you an instantly **portable luajit distro**
that will work reagardless of where you run it from. You will find the luajit executable in `bin/<your-platform>/`,
already configured to look for Lua modules in `../..` (relative to the executable's dir, not dir you start the
executable into). Binaries can then be [rebuilt][building] from source if so desired.

Or you can go the git way with [luapower-git], which gives you package management a la LuaRocks, but git-based.
Using this method, you can (among other things) clone all packages in one shot, you can build all C libraries
in one shot, and you can stay current with luapower by just pulling. You can also git-clone the packages yourself
with git and no additional tools, but... read on [luapower-git] before trying that.

> Some unit tests also need [unit].
> Some unit tests also need [unit].

## Directory Layout

Luapower packages follow some conventions on where the files are and how they are named:

  * main module: `<lib>.lua`
  * submodule: `<lib>_<sub>.lua` and sometimes `<lib>/<sub>.lua`
  * ffi cdef module: `<module>_h.lua`
  * test program: `<module>_test.lua`
  * demo: `<module>_demo.lua`
  * documentation: `<module>.md`
  * C libs:
    * sources: `csrc/<lib>/*`
    * build scripts: `csrc/<lib>/build-<platform>.sh`
    * binaries: `bin/mingw32/<lib>.dll`, `bin/linux32/lib<lib>.so`
	 * description: `csrc/<lib>/WHAT`
  * LuaJIT executable: `bin/<platform>/luajit`

As a result, packages can be safely unzipped over the same directory, and package management
can be [automated][luapower command].




[capr]:              https://github.com/capr
[luapower command]:  luapower-git.html#the-luapower-command
[unit]:              https://github.com/luapower/unit

