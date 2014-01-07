---
project:  luapower
title:    luapower
tagline:  Lua, JIT, batteries
---

![](luapower.png)

  * Lua libraries and bindings with demos, documentation, separate github repos
  * C libraries with sources, binaries and build scripts for Windows and Linux
  * LuaJIT executable
  * all free

pure Lua                                        Lua+ffi                                         Lua/C
------------------ ---------------------------- ------------------ ---------------------------- ------------------ ----------------------------
[glue]             everyday functions           [md5]              MD5                          [lpeg]             PEGs
[tuple]            real tuples                  [sha2]             SHA-256/384/512              [vararg]           varargs
[coro]             symmetric coroutines         [zlib]             deflate, gzip                [struct]           structs
[pp]               serialization                [minizip]          ZIP files                    [lanes]            threads
[oo]               OOP                          [pmurhash]         murmurhash                   [socket]           sockets
[utf8]             UTF-8                        [libb64]           base64                       [lfs]              file system
[dlist]            doubly-linked lists          [expat]            XML parsing                  [cjson]            JSON
[hmac]             HMAC hashing                 [genx]             XML creation
[murmurhash3]      murmurhash                   [mysql]            mysql client
[crc32]            CRC-32                       [fbclient]         firebird client
[path]             2D geometry                  [winapi]           winapi for GUIs
[affine2d]         2D transforms                [clipper]          polygon clipping
[box2d]            2D rectangles                [cairo]            2D graphics
[sg_cairo]         cairo scene graph            [openvg]           2D accel graphics
[svg_parser]       SVG parser                   [freetype]         text rasterization
[sg_gl]            OpenGL scene graph           [harfbuzz]         text shaping
[sg_gl_mesh]       OpenGL meshes                [libunibreak]      line breaking
[sg_gl_shape]      OpenGL shapes                [opengl]           OpenGL 1.1 & 2.1
[obj_parser]       wavefront obj parser         [bitmap]           in-memory bitmaps
[obj_loader]       obj loader                   [giflib]           read GIFs
[sg_gl_obj]        obj scene graph              [libjpeg]          read JPEGs
[cplayer]          procedural graphics          [libpng]           read PNGs
[codedit]          code editor                  [nanojpeg]         read JPEGs
[color]            HSL colors                   [libexif]          EXIF info
[easing]           for tweening                 [chipmunk]         2D physics
[eq2], [eq3]       equation solvers             [libvlc]           video playing
                                                [hunspell]         spell checking
------------------ ---------------------------- ------------------ ---------------------------- ------------------ ----------------------------

## Directory Layout

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
  * LuaJIT executable: `bin/<platform>/luajit`

## In Detail

A selection of the best Lua and C libraries out there, chosen for speed, portability, API stability and a free license.

Windows dlls are compiled with MinGW GCC 4.7 with `-O3 -s` and linked against msvcrt.dll,
using one-liner build scripts which "just work" provided you have MinGW in your `PATH`.

My own code is in public domain as I do not support copyright law. Most other libs are MIT.

An updated list of packages, with versioning and license info is coming soon. Stay tuned.
