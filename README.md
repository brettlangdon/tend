tend
====

Quick and easy cli command to watch a directory for file changes and run a
provided command when any files have been changed, removed or added.

## Installation

```bash
npm install -g tend
```

## Usage
```
Usage:
  tend (--help | --version)
  tend [--restart] [--ignoreHidden] <dir> <command> [<filter>]

Options:
  -h --help          Show this help text
  -v --version       Show tend version information
  -r --restart       If <command> is still running when there is a change, stop and re-run it
  -i --ignoreHidden  Ignore changes to files which start with "."
```

```bash
tend --restart --ignoreHidden ./ "node server.js"
```

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
