echo "> Start transpiling ES2015"
echo ""
rm -rf ./dist
./node_modules/.bin/babel --ignore __tests__ --plugins "transform-runtime" ./src --out-dir ./dist
echo ""
echo "> Complete transpiling ES2015"
