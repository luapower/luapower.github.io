--convert a literate Lua program to pandoc markdown.
--lines that begin with line-comments are stripped and what's in between comments
--is written between ~~~{.lua} ... ~~~ markers.

local file = ...

local state
for line in io.lines(file) do
	--if state == 'comment' and line == '' then
		--skip empty lines between comments
	if line:match'^%-%-%s' then
		if state == 'code' then
			io.write('~~~')
		end
		io.write(line:match('^%-%-%s(.*)')
		state = 'comment'
	elseif state == 'comment' then
		io.write('~~~{.lua}')
		state = 'code'
	else
		io.write(line)
	end
end
