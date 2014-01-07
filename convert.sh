# convert an .md file to a .html file which will be written in the dir of this script.
# also generates automatic reference definitions for local html files.

in_file="$1"
out_dir="$(cd "$(dirname "$0")"; echo "$PWD")"

[ "$in_file" ] || { echo "usage: $0 <input-file>"; exit 1; }

s="${in_file##*/}"  # strip path (linux)
s="${s##*\\}"       # strip path (windows)
s="${s%.*}"         # strip extension
docname="$s"
out_file="$out_dir/$docname.html"

[ "$template" ] || template=hack # default template
[ "$s" == "toc" ] && opt="$opt --variable=bare" # the TOC has no header/footer
[ "$s" == "index" ] && opt="$opt --variable=homepage" # homepage is special

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
) | pandoc -r markdown -w html --data-dir="$out_dir" --template="$template" --variable="docname:$docname" $opt > "$out_file"

echo "$out_file"
