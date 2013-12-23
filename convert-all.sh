# refresh the entire lua-files documentation, assuming `../lua-files` source path.

for f in *.md ../lua-files/*.md ../lua-files/winapi/*.md; do
	./convert.sh $f .
done

git add -A
git commit -m "update"
git push
