---
project: lua-files-devel
title:   lua-files
tagline: LuaJIT + batteries
---

## TL;dr

  * Lua libraries and bindings with demos, test files, documentation, separate github project
  * C libraries with sources, binaries and build scripts for Windows and Linux
  * LuaJIT2 executable
  * public domain

pure Lua                                        Lua+ffi                                         Lua/C
------------------ ---------------------------- ------------------ ---------------------------- ------------------ ----------------------------
[glue]             everyday functions           [md5]              MD5                          [lpeg]             PEGs
[tuple]            real tuples                  [sha2]             SHA-256/384/512              [varag]            varargs
[coro]             symmetric coroutines         [zlib]             deflate, gzip                [struct]           structs
[pp]               serialization                [minizip]          ZIP files                    [lanes]            threads
[oo]               OOP                          [pmurhash]         murmurhash                   [luasocket]        sockets
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
[obj_parser]       wavefront obj parser         [bitmap]           memory bitmaps
[obj_loader]       obj loader                   [giflib]           GIF files
[sg_gl_obj]        obj scene graph              [libjpeg]          JPEG files
[imagefile]        image files                  [libpng]           PNG files
[cplayer]          procedural graphics          [nanojpeg]         JPEG files
[codedit]          code editor                  [libexif]          EXIF info
[color]            HSL colors                   [chipmunk]         2D physics
[easing]           for tweening                 [libvlc]           video playing
[eq2], [eq3]       equation solvers             [hunspell]         spell checking
------------------ ---------------------------- ------------------ ---------------------------- ------------------ ----------------------------

## Directory structure

  * Lua module: `<lib>.lua`
  * Lua+ffi module: `<lib>.lua`, `<lib>_h.lua`
  * test file: `<lib>_test.lua`
  * demo: `<lib>_demo.lua`
  * documentation: `<lib>.md`
  * C lib sources: `csrc/<lib>/*`
  * C lib build script: `csrc/<lib>/build-<platform>.sh`
  * C lib binary: `bin/mingw32/<lib>.dll`, `bin/linux32/lib<lib>.so`
  * LuaJIT2 executable: `bin/<platform>/luajit`

## In Detail

The modules come bundled together into one directory for easy deployment and developing.
There's little functional dependency between them however, and they can be easily pulled
out and used separately if needed. Many modules depend on a small utility library called [glue].
Sources are indented with tabs so you can use any indentation with your editor without the
need to convert the files.

Portability varies between libraries. Some are Windows specific, some use the ffi API,
some specifically target LuaJIT for speed, while others are written in plain Lua and
should work on any platform. This is documented for each module individually.

Windows binaries for all C/C++ libraries are available in `bin`.
They are built using the sources and build scripts from `csrc`.
Everything is compiled with MinGW's GCC with `-O3 -s` and linked against msvcrt.dll,
using one-liner build scripts which "just work" provided you have MinGW in your `PATH`.

My own code is [public domain] as I do not support copyright law.
Third-party code has its licensing in or near the sources.
Generally, I tried to avoid viral GPL with some exceptions.

## Prose
  * [APIDesign API Design Notes] - how to design good APIs for your libraries
  * [GoodLibraries Good Libraries] - what makes or breaks a library



[public domain]:      http://unlicense.org/

[glue]:               glue.html
[tuple]:              tuple.html
[coro]:               coro.html
[pp]:                 pp.html
[oo]:                 oo.html
[utf8]:               utf8.html
[dlist]:              dlist.html
[hmac]:               hmac.html
[murmurhash3]:        murmurhash3.html
[crc32]:              crc32.html
[path]:               path.html
[affine2d]:           affine2d.html
[box2d]:              box2d.html
[sg_cairo]:           sg_cairo.html
[svg_parser]:         svg_parser.html
[md5]:                md5.html
[sha2]:               sha2.html
[zlib]:               zlib.html
[minizip]:            minizip.html
[pmurhash]:           pmurhash.html
[libb64]:             libb64.html
[expat]:              expat.html
[genx]:               genx.html
[mysql]:              mysql.html
[fbclient]:           fbclient.html
[winapi]:             winapi.html
[clipper]:            clipper.html
[cairo]:              cairo.html
[openvg]:             openvg.html
[lpeg]:               http://www.inf.puc-rio.br/~roberto/lpeg/
[lpeg.re]:            http://www.inf.puc-rio.br/~roberto/lpeg/re.html
[varag]:              vararg.html
[struct]:             http://www.inf.puc-rio.br/~roberto/struct/
[lanes]:              lanes.html
[luasocket]:          http://w3.impa.br/~diego/software/luasocket/reference.html
[lfs]:                http://keplerproject.github.com/luafilesystem/manual.html#reference
[cjson]:              http://www.kyne.com.au/~mark/software/lua-cjson-manual.html#_api_functions
[freetype]:           freetype.html
[harfbuzz]:           harfbuzz.html
[libunibreak]:        libunibreak.html
[opengl]:             opengl.html
[sg_gl]:              sg_gl.html
[sg_gl_mesh]:         sg_gl_mesh.html
[sg_gl_shape]:        sg_gl_shape.html
[obj_parser]:         obj_parser.html
[obj_loader]:         obj_loader.html
[sg_gl_obj]:          sg_gl_obj.html
[bitmap]:             bitmap.html
[giflib]:             giflib.html
[libjpeg]:            libjpeg.html
[nanojpeg]:           nanojpeg.html
[libpng]:             libpng.html
[libexif]:            libexif.html
[imagefile]:          imagefile.html
[cplayer]:            cplayer.html
[codedit]:            codedit.html
[color]:              color.html
[easing]:             easing.html
[chipmunk]:           chipmunk.html
[libvlc]:             http://www.videolan.org/developers/vlc/doc/doxygen/html/modules.html
[eq2]:                eq2.html
[eq3]:                eq3.html
[hunspell]:           hunspell.html

