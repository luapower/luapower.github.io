--acquire the list of packages, modules and documentation files.
--get doc metadata by reading doc's yaml header.
--get package versions using `git describe`.
--get package supported platforms by checking for the existence of build scripts.
--get module dependencies by tracking `require` calls.
--do various checks on the documentation and report missing documents and inconsistencies.
--create an automatic navigation tree for the entire documentation based on category tags and heuristics.
--TODO: generate toc.md
--TODO: generate packages.js and modules.js

local lfs = require'lfs'; lfs.chdir'..'
local glue = require'glue'
local module_dependencies = require'_site.dependencies'
local pp = require'pp'.pp

--file finding helpers

local function dir(p0, recurse) --recursive lfs.dir() -> iter() -> filename, path, mode
	assert(p0)
	local function rec(p)
		local dp = p0 .. (p and '/' .. p or '')
		for f in lfs.dir(dp) do
			if f ~= '.' and f ~= '..' then
				local mode = lfs.attributes(dp .. '/' .. f, 'mode')
				coroutine.yield(f, p, mode)
				if recurse and mode == 'directory' then
					rec((p and p .. '/' .. f or f))
				end
			end
		end
	end
	return coroutine.wrap(rec)
end

local function find(pat, path, recurse, simple) --search for a filename pattern and return matching filenames in a list
	local t = {}
	for f, p in dir(path, recurse) do
		local s = f:match(pat)
		if s then t[s] = simple or {} end
	end
	return t
end

--get the docs and their tags

local function kvsplit(s, sep) --"key <separator> value" -> key, value
	sep = glue.escape(sep)
	return s:match('^([^'..sep..']*)'..sep..'%s*(.*)$')
end

local function parse_tags(doc, t) --parse the yaml header of a pandoc .md file, enclosed by '---' lines
	local f = io.open(doc..'.md', 'r')
	if not f or f:read'*l' ~= '---' then error('no tags on '..doc..'.md') end
	for s in f:lines() do
		if s == '---' then break end
		local k,v = kvsplit(s, ':')
		k,v = k and glue.trim(k), v and glue.trim(v)
		if not k or k == '' then error('invalid tag '..s)
		elseif t[k] then error('duplicate tag '..k)
		else t[k] = v end
	end
	f:close()
end

-- *.md -> {doc_name = {title='', project='', category=''}}
local function get_docs()
	local docs = find('^(.-)%.md$', '.')
	for doc,t in pairs(docs) do
		parse_tags(doc, t)
		t.title = t.title or doc --default title is the doc's filename without extension
	end
	return docs
end

--get the modules and their parents

local function get_module_names()
	local mods = {} -- *.lua -> {module_name = {parent_module=''}}
	for f,p in dir('.', 'recurse') do
		local m = f:match'^(.-)%.lua$'
		if m and (not p or (not p:match'^bin/' and not p:match'^csrc/' and not p:match'^media/' and not p:match'^_')) then
			m = (p and p:gsub('/', '.') .. '.' or '') .. m --path,file -> module name
			mods[m] = {}
		end
	end
	return mods
end

local function parent_module_name(mod) --parent module name based on mod.submod and mod_submod conventions
	local parent = mod:match'(.-)[_%.][^_%.]+$'
	if not parent or parent == '' then return end
	return parent
end

local function parent_module(mod, mods) --the first ancestor module (parent, grandad etc) that actually exists
	local parent = parent_module_name(mod)
	if not parent then return end
	return mods[parent] and parent or parent_module(parent, mods)
end

local function get_modules()
	local mods = get_module_names()
	for mod,t in pairs(mods) do
		t.parent_module = parent_module(mod, mods)
	end
	return mods
end

--get the list of dependencies for documented modules

local function get_module_dependencies(mods, docs)
	for doc,t in pairs(docs) do
		local mod = doc
		if mods[mod] and not mods[mod].parent_module then
			mods[mod].dependencies = module_dependencies(mod)
		end
	end
end

--get the C source packages and their info

local function parse_what_file(cpkg, t)
	local f = assert(io.open('csrc/' .. cpkg .. '/WHAT'), 'WHAT file missing for '.. cpkg)
	local s = assert(f:read'*l', 'invalid WHAT file for '.. cpkg)
	t.realname, t.version, t.url, t.license = s:match('^(.-)%s+(.-)%s+from%s+(.-)%s+%((.*)%)$')
	if not t.realname then error('invalid WHAT file for '.. cpkg) end
	f:close()
end

local function get_csrc_packages()
	local cpkgs = {} -- csrc/*/WHAT -> {package_name = {name=, version=, url=, license=}}
	for cpkg, p, mode in dir('csrc') do
		if mode == 'directory' then
			local t = {}
			cpkgs[cpkg] = t
			parse_what_file(cpkg, t)
			--get supported platforms by checking for the existence of csrc/<package>/build-<platform>.sh scripts.
			t.platforms = find('^build%-(.-)%.sh$', 'csrc/'..cpkg, nil, true)
		end
	end
	return cpkgs
end

--get the git packages

local function get_packages()
	local pkgs = find('^(.-)%.exclude$', '_git') -- _git/*.exclude -> {package_name = {}}
	--TODO: infer the package type
	return pkgs
end

--get current git version for all packages

local function read_pipe(cmd)
	local f = io.popen(cmd, 'r')
	local s = f:read'*l'
	f:close()
	return s
end

local function get_package_versions(pkgs)
	for pkg,t in pairs(pkgs) do
		t.version = read_pipe('git.exe --git-dir="_git/'..pkg..'/.git" describe --tags --long --always')
	end
end

--infer doc categories where missing

local function fix_missing_doc_categories(docs, mods)
	for doc,t in pairs(docs) do
		--attach submodule docs to their parent module docs
		if not t.category and mods[doc] then --the doc matches a module name
			local parent_module = mods[doc].parent_module
			if parent_module and docs[parent_module] then --it's a submodule and its parent module is documented
				t.category = docs[parent_module].title
			end
		end
		--attach docs of projects to their project doc
		if not t.category and t.project and docs[t.project] then --its project is documented
			t.category = docs[t.project].title
		end
		--attach uncategorized docs to default categories
		if not t.category then
			t.category = mods[doc] and 'Other' or 'Prose'
		end
	end
end

--build the category tree

local function get_cat_tree(docs)
	--create a flat list of categories
	local cat = {} --{cat_name = {name='', doc='', parent_cat=cat_t, child1, child2, ...}}
	for doc,t in pairs(docs) do
		cat[t.category] = cat[t.category] or {name = t.category}
		cat[t.title] = cat[t.title] or {name = t.title, doc = doc}
	end
	for doc,t in pairs(docs) do --assign parents to titles
		cat[t.title].parent_cat = cat[t.category]
	end

	--build the tree
	local function add_children(parent_cat)
		for c,t in pairs(cat) do
			if t.parent_cat == parent_cat then
				table.insert(parent_cat, t)
				add_children(t)
			end
		end
	end
	local tree = {} --{cat1,cat2,...}
	for c,t in pairs(cat) do
		if not t.parent_cat then --it's a root category
			table.insert(tree, t)
			add_children(t)
		end
	end

	--sort the tree
	local function sort_children(parent)
		table.sort(parent, function(t1, t2) return t1.name < t2.name end)
		for i,t in ipairs(parent) do
			sort_children(t)
		end
	end
	sort_children(tree)

	return tree
end

--doc linting

local function count(t)
	local n = 0
	for k in pairs(t) do n = n + 1 end
	return n
end

local function print_list(title, t)
	if not next(t) then return end
	local s = string.format('%s (%d)', title, count(t))
	print(s)
	print(('-'):rep(#s))
	for k in glue.sortedpairs(t) do
		print(k)
	end
	print''
end

local function undocumented_packages(pkgs, docs)
	local t = {}
	for pkg in pairs(pkgs) do
		if not docs[pkg] then
			t[pkg] = true
		end
	end
	print_list('undocumented packages', t)
end

--modules that don't need documentation for submodules (it's all documented in the parent page).
local single_page_doc_modules = {
	cplayer=1,
	hmac=1,
	path_bezier2=1,
	path_bezier3=1,
	fbclient=1,
	utf8=1,
	bitmap=1,
	sg_cairo=1,
}
local function no_doc_submodule(mod, mods)
	local parent = mods[mod].parent_module
	return parent and single_page_doc_modules[parent]
end

--submodules which don't ascribe to the correct naming pattern.
local problem_no_doc_modules = {
	sg_base=1,
	sg_cache=1,
	svg_colors=1,
	glut=1,
	gl_types=1,
	gl_funcs11=1,
	gl_consts11=1,
	gl_funcs21=1,
	gl_consts21=1,
}
local function problem_no_doc_module(mod)
	return problem_no_doc_modules[mod]
end

--external modules with external documentation for their submodules.
local external_modules = {
	socket=1,
	lpeg=1,
	lexers=1,
}
local function external_module(mod)
	repeat
		mod = parent_module_name(mod)
		if external_modules[mod] then return true end
	until not mod
end

local function no_doc_module(mod, mods) --some modules don't need documenting
	return
		--places where modules don't need documenting
		mod:match'^bin%.'
		--classes of modules that don't need documenting
		or mod:match'_h$'
		or mod:match'_test$'
		or mod:match'_demo$'
		or mod:match'_benchmark$'
		--custom filters
		or problem_no_doc_module(mod)
		or external_module(mod)
		or no_doc_submodule(mod, mods)
end

--TODO: Lua/C modules are not detected!
local function undocumented_modules(mods, docs, include_submodules)
	local t = {}
	for mod in pairs(mods) do
		if not docs[mod] and not no_doc_module(mod, mods) then
			if include_submodules or not mods[mod].parent_module then
				t[mod] = true
			end
		end
	end
	print_list('undocumented modules', t)
end

local function uncategorized_modules(mods, docs)
	local t = {}
	for mod in pairs(mods) do
		if docs[mod] and docs[mod].category == 'Other' then
			t[mod] = true
		end
	end
	print_list('uncategorized modules', t)
end

local function unknown_csrc(mods)

end

local function duplicate_titles(docs)
	local titles = {}
	for doc,t in pairs(docs) do
		titles[t.title] = titles[t.title] or {}
		table.insert(titles[t.title], doc)
	end
	local dupes = {}
	for title,docs in pairs(titles) do
		if #docs > 1 then
			dupes[title] = table.concat(docs, ', ')
		end
	end
	if not next(dupes) then return end
	print'duplicate titles'
	print'----------------'
	for title,docs in glue.sortedpairs(dupes) do
		print(title, '->', docs)
	end
	print''
end

local function print_children(parent, indent)
	for i,t in ipairs(parent) do
		print(('   '):rep(indent) .. t.name .. (t.doc and ' (' .. t.doc .. ')' or ''))
		print_children(t, indent + 1)
	end
end
local function print_cat_tree(tree)
	print'category tree'
	print'-------------'
	print_children(tree, 0)
	print''
end

--main

local pkgs = get_packages()
local docs = get_docs()
local mods = get_modules()
local cpkgs = get_csrc_packages()
get_package_versions(pkgs)
get_module_dependencies(mods, docs) --only for documented modules
fix_missing_doc_categories(docs, mods) --attach modules to their parents and other docs to their projects

if false then
	pp(pkgs.cairo)
	pp(docs.cairo)
	pp(mods.cairo)
	pp(cpkgs.cairo)
end

local tree = get_cat_tree(docs, mods)
print_cat_tree(tree)

--[[
undocumented_packages(pkgs, docs)
undocumented_modules(mods, docs)
uncategorized_modules(mods, docs)
duplicate_titles(docs)
print_cat_tree(tree)
]]
