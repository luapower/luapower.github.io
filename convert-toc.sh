out_dir="x:/work/lua-files/docs"
in_file="$out_dir/toc.md"
out_file="$out_dir/toc.html"
pandoc -r markdown -w html --data-dir="$out_dir" --template="hack_toc" "$in_file" > "$out_file"
