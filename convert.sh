# convert file.md from current dir to docs/<basename>.html

[ "$1" ] || { echo "usage: $0 <markdown-file>"; exit 1; }

in_file="$1"
template="$2"; [ "$template" ] || template="hack"

out_dir="x:/work/lua-files/docs"
name="${in_file##*/}"
name="${name%%.md}"
out_file="$out_dir/$name.html"

#--print-default-template=html
pandoc -r markdown -w html --data-dir="$out_dir" --template="$template" "$in_file" > "$out_file"

echo "$out_file"
