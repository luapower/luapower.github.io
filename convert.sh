# convert an .md file to a .html file given an output dir

in_file="$1"
out_dir="$2"

[ "$in_file" -a "$out_dir" ] || exit 1

s="${in_file##*/}"  # strip path (linux)
s="${s##*\\}"       # strip path (windows)
s="${s%.*}"         # strip extension
out_file="$out_dir/$s.html"

[ "$template" ] || template=hack # default template
[ "$s" == "toc" ] && template="${template}_toc"  # table of contents has special template

pandoc -r markdown -w html --data-dir="$out_dir" --template="$template" "$in_file" > "$out_file"

echo "$out_file"
