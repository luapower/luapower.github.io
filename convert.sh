# convert an .md file to a .html file given an output dir.
# also generates automatic reference definitions for local html files and includes external-refs.md.inc.

in_file="$1"
out_dir="$2"

[ "$in_file" -a "$out_dir" ] || exit 1

s="${in_file##*/}"  # strip path (linux)
s="${s##*\\}"       # strip path (windows)
s="${s%.*}"         # strip extension
out_file="$out_dir/$s.html"

[ "$template" ] || template=hack # default template
[ "$s" == "toc" ] && template="${template}_toc"         # the table of contents uses a special template
[ "$s" == "lua-files" ] && opt=--variable=index

(cat "$in_file"
echo
echo
# generate reference definitions for local html files for easy cross-referencing
cd "$out_dir"
for f in *.html; do
	s="${f%.*}"      # strip extension
	echo "[$s]: $f"  # echo [doc]: doc.html
done
# include external references
cat external-refs.md.inc
) | pandoc -r markdown -w html --data-dir="$out_dir" --template="$template" $opt > "$out_file"

echo "$out_file"
