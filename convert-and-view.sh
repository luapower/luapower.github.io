# pandoc convert & view in browser
# Tip: use "Only One" chrome extension to avoid opening the same url in a new window every time

file="$1"

in_dir="$(pwd)"
out_dir="x:/work/lua-files/docs"

in_file="$in_dir/$file"
out_file="$out_dir/${file%%.md}.html"

"$out_dir/convert.sh" "$@"

"$USERPROFILE\Local Settings\Application Data\Google\Chrome\Application\chrome.exe" \
	--use-spdy=off --disable-application-cache --allow-file-access-from-files "$out_file"
