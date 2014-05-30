tend
====

[![NPM version](https://badge.fury.io/js/tend.svg)](http://badge.fury.io/js/tend)

Quick and easy cli command to watch a directory for file changes and run a
provided command when any files have been changed, removed or added.

## Installation

```bash
npm install -g tend
```

## Usage
```
Usage:
  tend
  tend <action>
  tend [--restart] [--start] [--ignoreHidden] [--filter <filter>] [<dir> <command>]
  tend (--help | --version)

Options:
  -h --help             Show this help text
  -v --version          Show tend version information
  -r --restart          If <command> is still running when there is a change, stop and re-run it
  -i --ignoreHidden     Ignore changes to files which start with "."
  -f --filter <filter>  Use <filter> regular expression to filter which files trigger the command
  -s --start            Run <command> as soon as tend executes
```

```bash
tend --restart --ignoreHidden ./ "node server.js"
```

### Options

#### tend

Running `tend` with no cli arguments will try to load your `.tendrc` file and start from any configuration set in that

#### tend <action>

`tend` will try to load your `.tendrc` file and run the command provided in the section `<action>`. It will run the command
once and will not watch for changes in `directory`.

#### tend [--restart] [--start] [--ignoreHidden] [--filter <filter>] [<dir> <command>]

Run `tend` with options for a single directory/command from cli rather than loading options from `.tendrc`.

#### tend (--help | --version)

Show help/version information about `tend`

### .tendrc

`tend` can accept it's configuration from a `.tendrc` file rather than taking arguments from
the command line. Using `.tendrc` also allows you to run multiple instances of `tend` at once.

`.tendrc` files are parsed using [rc](https://github.com/dominictarr/rc).

```ini
; global settings
ignoreHidden=true

[js]
directory=./src
command=uglifyjs -o ./build/main.min.js ./src/*.js

[app]
directory=./app
command=node ./app/server.js
restart=true
start=true
```

The above config will run two instances of `tend`:
```bash
tend --ignoreHidden ./src "uglifyjs -o ./build/main.min.js ./src/*.js"
# AND
tend --ignoreHidden --restart ./app "node ./app/server.js"
```

#### .tendrc Options
* `ignoreHidden` - ignore hidden folders
* `restart` - restart `command` if a file changes while the previous is still running
* `start` - start `command` when `tend` starts
* `directory` - the directory to watch for changes
* `filter` - regular expression filter for filenames which will trigger `command`
* `command` - the command to run when a file has changed

## License
```
The MIT License (MIT) Copyright (c) 2014 Brett Langdon <brett@blangdon.com> (http://brett.is)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
