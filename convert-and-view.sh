# pandoc convert & view in browser

# Tip: add the following to SciTE to convert and preview doc on F5:
#  command.go.$(file.patterns.markdown)=sh "x:/work/lua-files/docs/convert-and-view.sh" "$(FileNameExt)"

# Tip: use "Only One" chrome extension to avoid opening the same url in a new window every time

[ "$1" ] || { echo "usage: $0 <markdown-file>"; exit 1; }

out_file="$("$(dirname "$0")/convert.sh" "$@")"

"$USERPROFILE\Local Settings\Application Data\Google\Chrome\Application\chrome.exe" \
	--use-spdy=off --disable-application-cache --allow-file-access-from-files "$out_file"

# "X:\trash\firefox\firefox.exe" "file:///$out_file"

