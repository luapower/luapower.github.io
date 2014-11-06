# convert an .md file to a .html file and spawn a browser to view the result

# Tip: add the following to SciTE to convert and preview doc on F5:
#    command.go.$(file.patterns.markdown)=sh convert-and-view.sh "$(FilePath)"

# Tip: use "Only One" chrome extension to avoid opening the same url in a new window every time

out_file="$("$(dirname "$0")/convert.sh" "$@")"

# start "$out_file"

# to enable ajax on file:/// urls use:
chrome="C:\Program Files\Google\Chrome\Application\chrome.exe"
[ -f "$chrome" ] || chrome="$USERPROFILE\Local Settings\Application Data\Google\Chrome\Application\chrome.exe"
[ -f "$chrome" ] || chrome="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

"$chrome" \
	--use-spdy=off \
	--disable-application-cache \
	--allow-file-access-from-files \
	--user-data-dir="$(dirname "$0")/../_chrome" \
	--disable-web-security \
	--enable-file-cookies \
	"$out_file"

# to view with firefox use: "<path-to-firefox>\firefox.exe" "file:///$out_file"
