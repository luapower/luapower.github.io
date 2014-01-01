# refresh the entire documentation, assuming `..` source path.

i=0
for f in *.md ../*.md ../winapi/*.md ../_git/*.md; do
	i=$((i + 1))
	./convert.sh $f . &
	[ $((i % 4)) == 0 ] && wait
done

git status -s
