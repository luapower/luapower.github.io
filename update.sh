# refresh the entire lua-files documentation, assuming `../lua-files` source path.

for f in *.md ../*.md ../winapi/*.md ../_git/*.md; do
	./convert.sh $f .
done

export HOME="$USERPROFILE"

git add -A
git commit -m "update"
git push
