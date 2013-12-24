---
project: lua-files-git
title:   lua-files
tagline: git-based Lua/LuaJIT2 distribution
---

## On this site you will find

  * Lua solutions for a wide range of programming tasks, from table serialization to bezier curve math.
  * LuaJIT ffi bindings for many popular libraries like mysql, expat, cairo.
  * Lua modules targeted at the LuaJIT compiler for tasks like bitmap conversions and alpha blending.
  * Win32 API bindings for windows and common controls.
  * Windows binaries for all libraries involved and simple scripts for building them.
  * Everything free (public domain).

Cosmin Apreutesei \
cosmin.apreutesei@gmail.com

## Get started

Download and unzip the [packages](http://lua-files.org/downloads).
Run demos: cd to `lua-files` and type `bin\luajit.exe <*_demo>.lua`

To make sure you always get the most recent files, use Mercurial:

	hg clone https://code.google.com/p/lua-files/
	hg clone https://code.google.com/p/lua-files.media lua-files/media

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
