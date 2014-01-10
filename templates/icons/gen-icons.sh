convert() {
	python gen-icon.py --size 22 --color $1 windows --filename icon-mingw32-$2.png
	python gen-icon.py --size 22 --color $1 windows --filename icon-mingw64-$2.png
	python gen-icon.py --size 22 --color $1 linux   --filename icon-linux32-$2.png
	python gen-icon.py --size 22 --color $1 linux   --filename icon-linux64-$2.png
	python gen-icon.py --size 22 --color $1 android --filename icon-android-$2.png
	python gen-icon.py --size 22 --color $1 apple   --filename icon-macosx32-$2.png
	python gen-icon.py --size 22 --color $1 apple   --filename icon-macosx64-$2.png
}
convert "#dddddd" light
convert "#333333" dark
