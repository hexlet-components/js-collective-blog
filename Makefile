install: install-deps install-flow-typed

install-deps:
	yarn

install-flow-typed:
	npm run flow-typed install

make develop-start:
	DEBUG=hexlet-collective-blog npm run nodemon src/bin/hexlet-collective-blog.js

build:
	rm -rf dist
	npm run build

test:
	DEBUG=hexlet-collective-blog npm test

check-types:
	npm run flow

lint:
	npm run eslint -- src test

publish:
	npm publish

.PHONY: test
