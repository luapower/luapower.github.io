# find/replace the string `requires: .*` in all <module>.md files corresponding to a <module>.lua file.

cd ..
for s in *.md; do
	s="${s%.*}"  # strip extension
	[ -f "$s.lua" ] && grep "requires:" "$s.md" && {
		deps="$(cd _docs; cmd.exe //C ..\\bin\\mingw32\\luajit.cmd dependencies.lua "$s")"
		sed -i "s/requires\:.*/requires\: $deps/" "$s.md"
	}
done
