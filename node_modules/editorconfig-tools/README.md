# editorconfig-tools
[![Build Status](http://img.shields.io/travis/slang800/editorconfig-tools.svg?style=flat-square)](https://travis-ci.org/slang800/editorconfig-tools) [![NPM version](http://img.shields.io/npm/v/editorconfig-tools.svg?style=flat-square)](https://www.npmjs.org/package/editorconfig-tools) [![NPM license](http://img.shields.io/npm/l/editorconfig-tools.svg?style=flat-square)](https://www.npmjs.org/package/editorconfig-tools)

This tool-set is for validating or fixing code that doesn't adhere to settings defined in `.editorconfig`. It also is able to infer settings from existing code and generate an `.editorconfig` file that matches all the files that are passed to it. See the [EditorConfig Project](http://editorconfig.org/) for details about the `.editorconfig` file.

## CLI
The CLI is (currently) the only way of using editorconfig-tools. The following sections detail the 3 subcommands that editorconfig-tools provides.

### infer
Infer `.editorconfig` settings from one or more files and generate an `.editorconfig` file that matches all the files that are passed to it.

Here's an example using the files from this project. It is assumed that you have [globstar](http://www.linuxjournal.com/content/globstar-new-bash-globbing-option) enabled in your shell. While editorconfig-tools itself doesn't require it, these examples do use it to pass whole directories of files to editorconfig-tools.

```bash
$ editorconfig-tools infer ./* ./lib/**/* ./test/**/*
[*]
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[{./test/fixtures/end-of-line/file}]
end_of_line = crlf

[{./Makefile,./test/fixtures/indent-char-tab/file}]
indent_style: tab

[{./test/fixtures/insert-final-newline-false/file}]
insert_final_newline = false
```

As you can see, a set of rules has been generated that matches all of the files that we passed in. If we were making an `.editorconfig` file for a project that doesn't already have one, we might want to write this out to a file:

```bash
$ editorconfig-tools infer ./* ./lib/**/* ./test/**/* > .editorconfig
```

We would still probably want to add `root = true` to the file (if this is saved at the root of the project), but editorconfig-tools has done most of the work required to make an `.editorconfig` file.

### check
Check (validate) that file(s) adhere to `.editorconfig` settings and return a non-zero exit code if errors are encountered (making it suitable for running as a test). For example, if we added some trailing whitespace to our readme, this would be the result:

```bash
$ editorconfig-tools check README.md
README.md failed trim_trailing_whitespace on line 46: found setting 'false', should be 'true'
```

### fix
Fix formatting errors that disobey `.editorconfig` settings. This will modify your files without warning, so you should ensure that your project is under version control before running it.

For example, if we write a file with 4-space indentation, and then run the fix command (using the settings of this particular project) we will get back a 2-space indented file:

```bash
$ echo -e 'line one\n    line two' > example-file
$ editorconfig-tools fix ./example-file
$ cat example-file
line one
  line two
```

## Similar Tools
- [eclint](https://github.com/jedmao/eclint)
- [treyhunner/editorconfig-tools](https://github.com/treyhunner/editorconfig-tools)
