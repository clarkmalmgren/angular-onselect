# Contributing to Angular On Select

## Submitting Issues

Just do it. Please include meaningful titles and descriptions.

## Guidelines

Contributions are welcome via pull requests. Please adhere to the following guidelines:
 
  * [John Papa's Angular Style Guide](https://github.com/johnpapa/angular-styleguide)
  * At least 90% Unit Test Coverage
  * Use [the AVH version of git flow](https://github.com/petervanderdoes/gitflow-avh)
    * `git flow feature start <useful-title>`
    * Then send a pull request to `develop`

## Getting Started

### Cloning the Repository

Nothing special here. Just follow the [standard directions](https://help.github.com/articles/fork-a-repo/). 

### Install NodeJS & NPM

On OS X, use [Homebrew](http://brew.sh/):

```bash
$ brew install node
$ brew install npm
```

### Globally Install Gulp

[Gulp](http://gulpjs.com/) is the tool that is used to build and test this project. It needs to be installed globally
in order for it to work from the command line. You can do that by issuing the following command:

```bash
npm install -g gulp
```

### Install NPM Dependencies

This is really just using npm for dependency management so you need to install your dependencies with the following
command:

```bash
$ npm install
```

_Note: there aren't any bower dependencies so there is no need to do a `bower install`._ 


### Build System

The build process is pretty simple. Below is the list of gulp tasks and what they do. To run any of them, simply
call `gulp <task>` from the project root.

Task        | Description
:---------- | :----------
clean       | deletes the `build` folder
build       | creates the production version of the sources in the `dist` folder
test        | run tests using karma (in chrome)
test-run    | run tests using karma (in chrome) and then leave it running.  Great for developing and debugging tests.
test-ci     | run tests using karma (in phantomjs) headless testing for CI machines like [Travis CI](https://travis-ci.org/)
coverage    | export coverage to coveralls

The default task (just calling `gulp` with no task) is the same as calling `gulp test build`.

### Project Layout

```text
├── CONTRIBUTING.md                         This File
├── LICENSE                                 MIT License
├── README.md                               Top-level README
├── bower.json                              Defines project for http://bower.io/
├── build
│   └── test-reports                        Test results go here
├── dist
│   └── angular-onselect.js                 Results of the build process
├── example
│   ├── app.js                              Example JS Controller
│   └── index.html                          Example HTML Application
├── gulpfile.js                             The Build File
├── karma-ci.conf.js                        Karma Configuration for CI Machines
├── karma.conf.js                           Karma Configuration for Developers
├── node_modules                            Folder where dependencies go
├── package.json                            Defines the project for npm
└── src
    ├── onselect.directive.js               Defines the angular directive
    ├── onselect.directive.spec.js          Tests
    ├── onselect.module.js                  The module definition
    ├── range.service.js                    Most of the actual meat of the service is here
    └── range.service.spec.js               Tests
```

### Testing System

This uses the following toolchain:

  * [Karma](https://karma-runner.github.io) - Test Runner
  * [Mocha](http://mochajs.org/) - Test Framework
  * [ng-describe](https://github.com/kensho/ng-describe) - BDD specs for Angular (reduces boilerplate code)
  * [Chai](http://chaijs.com/) - Assertion Library
  * [Sinon](http://sinonjs.org/) - (Spy|Stub|Mock)ing Library
  * [Sinon Chai](https://github.com/domenic/sinon-chai) - Better assertion language for Sinon
  * [Istanbul](https://gotwarlost.github.io/istanbul/) - Code Coverage

### Developing Tests

Tests should be well organized into functional groups using `ngDescribe` and `describe` blocks. Each test should also
read descriptively in a hierarchical fashion. The test should also be separated into given, when, then phases with
comments to delinate setup, run and verification parts of a test.  There could be multiple when and then blocks in a
single test.

It is also extremely helpful when developing or debugging tests to use `gulp test-run`, find the open chrome window,
and then click on the debug button.  This will show the hierarchy of tests, what failed and didn't and allows you to
re-run tests by refreshing the window or by clicking on a link which will run that section and it's children.

## More Questions?

Feel free to create a github issue and just mark it as "help wanted".
