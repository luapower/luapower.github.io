# refresh all documentation

for f in *.md ../winapi/*.md ../*.md; do
	./convert.sh "$f"
done

./convert-toc.sh
