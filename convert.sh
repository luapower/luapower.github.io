# convert file.md from current dir to docs/<basename>.html

[ "$1" ] || { echo "usage: $0 <markdown-file>"; exit 1; }

file="$1"
template="$2"
[ "$template" ] || template="hack"

in_dir="$(pwd)"
out_dir="x:/work/lua-files/docs"

in_file="$in_dir/$file"
out_file="$out_dir/${file%%.md}.html"

#--print-default-template=html
pandoc -r markdown -w html --data-dir="$out_dir" --template="$template" "$in_file" > "$out_file"

echo "$out_file"
