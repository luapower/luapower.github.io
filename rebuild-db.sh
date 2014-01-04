basedir="$(dirname "$0")"
cd "$basedir/.."

echo -n > "$basedir/_docs/db.js"
log() { echo "$@" >> "$basedir/_docs/db.js"; }

json_str() {
	s="$1"
	s="${s//\\/\\\\}" # \
	s="${s//\//\\\/}" # /
	s="${s//\'/\\\'}" # ' (not strictly needed ?)
	s="${s//\"/\\\"}" # "
	echo "$s"
}

log "jQuery(["
for package in `_git/packages.sh`; do
	version="$(PROJECT=$package ./git describe --tags --long --always)"
	tagline=""; [ -f "$package.md" ] && tagline="$( cat $package.md | sed -n 's/^tagline:[ ]*\(.*\)$/\1/p' )"
	deps=""; [ -f "$package.lua" -o -f "$package/init.lua" ] && deps="$(_docs/dependencies $package 2>/dev/null)"

	printf "%-16s %-30s %s\n" "$package" "$version" "$tagline"
	#echo "depends: $deps"

	version="$(json_str "$version")"
	tagline="$(json_str "$tagline")"
	log "{package: '$package', version: '$version', tagline: '$tagline', deps: '$deps'},"

done
log "])"

