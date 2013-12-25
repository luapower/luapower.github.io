---
project: lua-files-git
tagline: Git workflow for lua-files
---

## What?

A portable LuaJIT2 binary+source distribution for Windows and Linux.

Many types of libraries:

  * ffi bindings to many popular C libraries like mysql, expat, cairo.
  * Lua C libraries like luasocket, lfs, lanes.
  * Lua solutions for a wide range of programming tasks, from table serialization to bezier curve math.
  * Lua+ffi modules targeted at the LuaJIT compiler for tasks like bitmap conversions and alpha blending.
  * Lua+ffi Win32 API bindings for windows and common controls.

Each library comes complete with binaries, sources and build scripts:

  * binaries for 32bit Windows and Linux so you can start coding right away
  * C sources so you can rebuild them on different platforms
  * the simplest build scripts invoking gcc directly so you can upgrade and rebuild
  * a small demo or test file, many of which are GUI+graphics demos
  * your choice on how to use the documentation: online (this website) or in your editor (plain text)

Everything is modular and free:

  * modular: only add what you need, each library has its own git project.
  * Everything free (public domain).


## Get started, the easy way



## Get started, the git way

The default Lua search path looks for `<module>.lua` in the current directory. This is a comfortable scheme
but it requires the ability to clone multiple repos into the same directory. Luckily, git can do that.

The trick is to separate the files from the git repos:

	mkdir files
	mkdir repos

	git clone -n ssh://git@github.com/capr/affine2d repos/affine2d
	git --git-dir=repos/affine2d/.git --work-tree=files checkout

	git clone -n ssh://git@github.com/capr/bitmap repos/bitmap
	git --git-dir=repos/bitmap/.git --work-tree=files checkout

	... and so on, with all the packages that you need

Now the Lua modules are directly in the `files` dir, so you can:

  * `cd files` and run programs from there (eg. you can run the demos like that).
  * add `full-path-to-files` to your `package.path` and `full-path-to-files/bin` to your `package.cpath`
    and run programs from anywhere.
  * set `LUA_PATH=full-path-to-files` and `LUA_CPATH=full-path-to-files/bin` and run programs from anywhere.

To avoid specifying `--git-dir` and `--work-tree` on every git command, you can edit `.git/config` for each package
and add `worktree = ../../../files` under the `[core]` section. This allows you to use git as usual from
the `repos/<module>` dir.

If you like the flexibility of this approach but don't want to be bothered typing all these git commands,
there's a little project called `lua-files-git` that wraps it all up in basic shell scripts:

	git clone ssh://git@github.com/capr/lua-files-git

> For Windows you need MSYS in your PATH because these are all bash scripts
> (sorry, I never bothered to learn powershell). You need MSYS and MinGW in your PATH for building these libraries anyway.

------------------------------------ ------------------------------------
./list.sh                            list all packages
./clone.sh <package>                 clone a package
./clone-all.sh                       clone all packages
./build.sh <package> <platform>      build a package (platform is `mingw32` or `linux32`)
./build-all.sh <platform>            build all packages in order
------------------------------------ ------------------------------------

## In Detail

The modules come bundled together into one directory for easy deployment and developing. There's little functional dependency between them however, and they can be easily pulled out and used separately if needed. Many modules depend on a small utility library called [glue]. Sources are indented with tabs so you can use any indentation with your editor without the need to convert the files.

Portability varies between libraries. Some are Windows specific, some use the ffi API, some specifically target LuaJIT for speed, while others are written in plain Lua and should work on any platform. This is documented for each module individually.

Windows binaries for all C/C++ libraries are available in [http://lua-files.org/source/browse/#hg%2Fbin bin]. They are built using the sources and build scripts from [http://lua-files.org/source/browse/#hg%2Fcsrc csrc]. Everything is compiled with MinGW's GCC with `-O3 -s` and linked against msvcrt.dll, using one-liner build scripts which "just work" provided you have MinGW in your `PATH`.

My own code is [public domain] as I do not support copyright law. Third-party code has its licensing in or near the sources. Generally, I tried to avoid viral GPL with some exceptions.

# Modules

## Basic tools
  * [glue] - everyday functions
  * [tuple] - real tuples
  * [coro] - symmetric coroutines
  * [pp] - fast pretty printer / serializer
  * [oo] - object system with virtual properties and overriding hooks
  * [lpeg](http://www.inf.puc-rio.br/~roberto/lpeg/), [lpeg.re](http://www.inf.puc-rio.br/~roberto/lpeg/re.html) - parsing expression grammars (lpeg 0.10.2)
  * [vararg] - fast vararg utils
  * [utf8] - utf8 basics
  * [struct](http://www.inf.puc-rio.br/~roberto/struct/) - Roberto's struct library
  * [dlist] - doubly linked lists
  * [tricks] - Lua tricks, LuaJIT assumptions

## Basic OS
  * [lanes] - multi-threading
  * [luasocket](http://w3.impa.br/~diego/software/luasocket/reference.html) - sockets (luasocket 2.0.2; base and url modules only)
  * [lfs](http://keplerproject.github.com/luafilesystem/manual.html#reference) - basic filesystem access (luafilesystem 1.6.2)

## Hasing and compression
  * [md5] - MD5 sum and digest
  * [sha2] - SHA-256, SHA-384, SHA-512 hashing
  * [hmac] - HMAC hashing
  * [zlib] - inflate/deflate, gzip/gunzip, CRC-32 and Adler-32 sum
  * [minizip] - read/write zip files
  * [pmurhash] - murmurhash3 C implementation
  * [murmurhash3] - murmurhash3 Lua implementation
  * [crc32] - CRC-32 Lua implementation

## Internet formats
  * [libb64] - fast base64 encoding and decoding
  * [expat] - XML parsing
  * [genx] - XML formatting
  * [http://www.kyne.com.au/~mark/software/lua-cjson-manual.html#_api_functions cjson] - fast json encoding and decoding (Lua CJSON 2.1.0)

##  Databases
  * [mysql] - complete mysql binding
  * [fbclient] - firebird binding

## Windows
  * [winapi] - bindings for windows and the message loop, standard controls and dialogs, gdi, cairo, opengl and openvg panel components

## 2D Vector Graphics
  * [path] - fast 2D geometry library
  * [affine2d] - fast affine transformations
  * [clipper] - polygon clipping and offsetting
  * [cairo] - cairo graphics library
  * [openvg] - openvg API and binding for `AmanithVG`
  * [sg_cairo] - cairo scene graph rendering
  * [svg_parser] - svg parser to a cairo scene graph

## Text Layouting & Rasterization
  * [freetype] - font rasterization
  * [harfbuzz] - complex text shaping
  * [libunibreak] - unicode line & word breaking

## 3D Graphics
  * [opengl] - bindings to OpenGL 1.1 and 2.1 + GLU, GLUT, WGL and  APIs
  * [sg_gl] - opengl scene graph rendering
  * [sg_gl_mesh] - OpenGL rendering of meshes via vertex/index buffers
  * [sg_gl_shape] - OpenGL scene graph rendering of shapes via vertex/index buffers
  * [obj_parser] - callback-based wavefront obj parser
  * [obj_loader] - wavefront obj loader to opengl scene graph mesh format
  * [sg_gl_obj] - OpenGL scene graph rendering of wavefront obj files

## Raster Images
  * [bitmap] - in-memory bitmaps: format conversions, dithering, blending, effects
  * [giflib] - read GIF files
  * [libjpeg] - read JPEG files
  * [nanojpeg] - read JPEG files simply (but slowly)
  * [libpng] - read PNG files
  * [libexif] - read EXIF information from image files
  * [imagefile] - read various raster image formats with a single API

## GUI
  * [cplayer] - cairo-based GUI access layer + immediate mode widgets (Windows only)
  * [codedit] - code editor engine written in Lua
  * [box2d] - 2D rectangle math for GUIs

## Colors
  * [color] - color conversions in HSL space

## Animation
  * [easing] - easing functions for tweening

## Physics
  * [chipmunk] - chipmunk ffi binding and binary

## Video
  * [libvlc](http://www.videolan.org/developers/vlc/doc/doxygen/html/modules.html) - VLC 2.0.5, plugins dir not included

## General Purpose Math
  * [eq2] - quadratic equation solver
  * [eq3] - cubic equation solver

## Text proofing
  * [hunspell] - spell checking

## Prose
  * [APIDesign API Design Notes] - how to design good APIs for your libraries
  * [GoodLibraries Good Libraries] - what makes or breaks a library



[public domain]: http://unlicense.org/
