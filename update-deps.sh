# find/replace the string `| requires: .*` in all <module>.md files corresponding to a <module>.lua file.

cd ..
for s in *.md; do
	s="${s%.*}"  # strip extension
	[ -f "$s.lua" ] && grep "requires:" "$s.md" >/dev/null && {
		deps="$(cd _docs; sh ./dependencies.sh "$s")"
		sed -i "s/ \| requires\: /d" "$s.md"
		#sed -i "s/ \| requires\:.*/ \| requires\: $deps/" "$s.md"
	}
done
