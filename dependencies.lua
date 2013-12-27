--print dependencies of a module by tracing the `require` calls.

local module_name, display = ...
if not module_name then
	print(string.format('usage: %s <module> [direct | tree | all | sub]', arg[0]))
	return 1
end

--standard names to appear in the list before other names
local std = {}
for k in pairs(package.loaded) do
	std[k] = true
end
std.ffi = true
std.jit = true

--excluded names, to ignore
exclude = {string = true, table = true, coroutine = true, package = true, io = true}

local function is_submodule(name) --check if name is a submodule of module_name
	return name == module_name or name:match('^'..module_name..'[%.%_]')
end

--trace require'd names
loaded = {} --all require'd modules
direct = {} --direct dependencies of modules and submodules
subs = {}   --submodules
local require_ = require
local level = 0
local parents = {}
local parent
function require(m)
	if display == 'tree' then
		print(('  '):rep(level) .. m)
	end
	if parent then
		loaded[m] = true
		if is_submodule(m) then
			subs[m] = true
		elseif is_submodule(parent) then
			direct[m] = true
		end
	end
	level = level + 1
	table.insert(parents, parent)
	parent = m
	local ret = require_(m)
	level = level - 1
	parent = table.remove(parents)
	return ret
end
require(module_name)

if display == 'tree' then return end
if display == 'sub' then loaded = subs end
if not display or display == 'direct' then loaded = direct end

--collect names to a list
local t = {}
for k in pairs(loaded) do
	if not exclude[k] then
		t[#t+1] = k
	end
end

--sort names by std then by name
table.sort(t, function(a, b)
	if std[a] == std[b] then
		return a < b
	else
		return not std[b]
	end
end)

--finally, print out the list of dependencies
for i,s in ipairs(t) do
	t[i] = string.format('%s', s)
end
print(table.concat(t, ', '))

