# refresh all documentation

for f in `ls *.md`; do
	./convert.sh "$f"
done

./convert-toc.sh

cd ..
for f in `ls *.md`; do
	docs/convert.sh "$f"
done
