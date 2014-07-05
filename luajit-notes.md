---
title:   LuaJIT notes
tagline: assumptions, gotchas, tricks
---

## LuaJIT assumptions

  * LuaJIT hoists table accesses with constant keys (so module functions) out of loops,
  so no point caching those in locals.
  * LuaJIT hoists constant branches out of loops so it's ok to specialize loop kernels
  with if/else or and/or inside the loops.
  * LuaJIT inlines functions (except when using `...` and `select()` with non-constant indices),
  so it's ok to specialize loop kernels with function composition.
  * multiplications and additions are cheaper than memory access, so storing the results of these
  operations in temporary variables might actually harm performance.
  * there's no difference between using if/else and using and/or expressions - they generate the
  same pipeline-trashing branch code (so avoid non-constant and/or in tight loops).
  * divisions are 4x slower than multiplications, so when dividing by a constant, it helps
  turning `x / c` into `x * (1 / c)` since the constant expression is folded -- LuaJIT seems
  to do this already for power-of-2 constants where the semantics are equivalent. (are they?)
  * the `%` operator is slow (it's implemented in terms of `math.floor()` and division) and really
  kills hot loops; `math.fmod()` is even slower; I don't have a solution for this
  (except for `x % 2^n` which can be made with bit ops).

The above are assumptions I use throughout my code, so if any of them are wrong, please correct me.

## LuaJIT gotchas

### `null_ptr == nil`

`ptr == nil` evaluates to true for a nil pointer. As innocent as this looks, this is actually a language extension
because in Lua 5.1 world, objects of different types can't ever be equal (in this case type `cdata` == type `nil`).

This has two implications:

1. Luaffi cannot implement this for Lua 5.1, so compatibility with Lua cannot be acheived if this idiom is used.
2. The `if ptr then` idiom doesn't work, although you'd expect that anything that `== nil` to pass the `if` test too.

Both problems can be solved easily with a null filter `function ptr(p) return p ~= nil and p or nil end` which
must be applied on pointers flowing into Lua (mostly from constructors). You can later reimplement this filter
when porting to luaffi.

### `array[i], array[j] = array[j], array[i]`

This idiom doesn't work as you would expect (swapping) when the array elements are structs.
This is because array indexing returns a reference type for structs, not a copy of the struct object.
Just something to keep in mind.

### Callbacks and JIT

JIT must be disabled on any Lua function that calls a C function that can trigger a ffi callback or you might
get a "bad callback" exception. LuaJIT takes great pains to ensure that you won't, but there's no guarantee.
This can turn into a "99% is worse than 0%" situation, because you might forget to disable the jit for a
particular callback-triggering function only to get a crash in production.

There is no way that I know of to disable these jit barriers.

### Callbacks and passing structs by value

Currently, passing structs by value or returning structs by value is not supported with callbacks.
This is generally not a problem, as most APIs don't do that, with the notable exception of OSX APIs
which do that _a lot_. I have no solution for this (yet).

### Cdata finalizer call order

Finalizers for cdata objects are called in undefined order. This means that objects anchored in a finalizer
are not guaranteed to not be already finalized when that finalizer is called.

Consider this:

~~~{.lua}
local heap = ffi.gc(CreateHeap(), FreeHeap)

local mem = ffi.gc(CreateMem(heap, size), function(mem)
	FreeMem(heap, mem) -- heap anchored in mem's finalizer
end)
~~~

When the program exits, sometimes the heap's finalizer is called before mem's finalizer,
even though mem's finalizer holds a reference to heap. So it's ok and useful to anchor objects in finalizers,
but don't _use_ them in finalizers unless you can ensure that they're still alive by other means.

There is no way to fix this with the current garbage collector.

### Floating points from outside

In places where an arbitrary bit pattern can be injected in place of a double or float, you have to
normalize these to a standard NaN pattern (`0xffc00000` for floats and `0xfff8000000000000` for doubles),
or check for NaN before accessing them. Failing to do so will get you a crash.

> The bit pattern for NaN is: exponent is all '1', mantissa non-zero, sign ignored.

Here's a handy NaN checker for doubles:

~~~{.lua}
local cast, band, bor = ffi.cast, bit.band, bit.bor
local lohi_p = ffi.typeof("struct { int32_t "..(ffi.abi("le") and "lo, hi" or "hi, lo").."; } *")

local function double_isnan(p)
   local q = cast(lohi_p, p)
   return band(q.hi, 0x7ff00000) == 0x7ff00000 and
	        bor(q.lo, band(q.hi, 0xfffff)) ~= 0
end
~~~

### LuaJIT memory restrictions

LuaJIT must be in the lowest 2G of address space on x64. This applies to all GC-managed memory,
including `ffi.new` allocations. Use malloc, mmap, etc. to access all memory without restrictions.
Keep the low 2G of your address space free for LuaJIT (this might be hard depending on how you
integrate LuaJIT in your app). Needless to say, if your memory usage on x86 is above 2G,
your app is already not portable to x64. Also, in one-Lua-state/core/thread scenarios the memory
available for each core is 2G/number-of-cores. If you use malloc, watch out for problems with
finalization order: finalization and freeing are the same thing now.


## LuaJIT tricks

Pointer to number conversion that turns into a no-op when compiled:

	tonumber(ffi.cast('intptr_t', ffi.cast('void *', ptr)))

Switching endianness of a 64bit integer (to use in conjunction with `ffi.abi'le'` and `ffi.abi'be'`):

	local p = ffi.cast('uint32*', int64_buffer)
	p[0], p[1] = bit.bswap(p[1]), bit.bswap(p[0])
