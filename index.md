---
title:    luapower
tagline:  Lua, JIT, batteries
---

![](luapower.png)

  * LuaJIT binary + source distribution and module repository
  * platform for publishing Lua modules

<div class="bg bg-pd"></div>

## News

<div id="news_table">loading...</div>

## Modules

<div id="package_table">loading...</div>
<div style="width: 100%; text-align: right; font-size: 80%">manifest file: [Lua](packages.lua) | [JSON](packages.json)</div>

## LUA POWER IS

  * __PORTABLE__: no install, just unzip and run
  * __MODULAR__: separate repo for each module
  * __ON GITHUB__: fork/pull-request workflow
  * __NO DIRECTORIES__: all modules in a single directory
  * __BINARIES__: get code running in minutes
  * __SOURCES & BUILD SCRIPTS__: upgrade it yourself
  * __PACKAGE DATABASE__: self-maintaining, auto-generated
  * __DOCUMENTED__: online & offline, based on pandoc-enhanced markdown
  * __FREE(\*)__: no-strings attached

> (\*) My code is in public domain (PD) as I do not support the copyright law.
The rest is mostly free as-in non-viral, but licenses are listed so you can choose for yourself.

## Get Started

  1. download [luajit]
  2. choose/download wanted packages along with their listed dependencies
  3. unzip all _over a single directory_
  4. (optional) [rebuild][building] binaries
  5. run a demo: `luajit ..._demo.lua`

This will give you an instantly **portable luajit distro** that will work reagardless of where you run it from.
The luajit binary is in `bin/<your-platform>/` (cmd and sh wrappers are in the root dir).

Alternatively you can go the git way with [luapower-git] which allows you to:

  * clone/build everything in one shot
  * keep your modules up-to-date by pulling
  * [create your own modules][get-involved] and publish them

> NOTE: Dependencies are not listed anywhere for demos and test units, so I better tell you now:
some test units need [unit], and most demos need [cplayer] and [glue].

> NOTE: Packages marked `dev` are either in active development or are planned for more development in the future.
In any case, they are not yet ready for public consumption. Poke around of course, just don't expect stability.


[capr]:  https://github.com/capr
[unit]:  https://github.com/luapower/unit
