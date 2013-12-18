# pandoc convert & view in browser
# Tip: use "Only One" chrome extension to avoid opening the same url in a new window every time

file="$1"

in_dir="$(pwd)"
out_dir="x:/work/lua-files/docs"

in_file="$in_dir/$file"
out_file="$out_dir/${file%%.md}.html"

#--print-default-template=html
pandoc -r markdown -w html --data-dir="$out_dir" --template="hack" "$in_file" > "$out_file"
