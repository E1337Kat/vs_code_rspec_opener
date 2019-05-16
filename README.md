# openspecs README

openspecs is a light tool to make it easier to write tests for your rspec using rails project. I find myself opening a lot of files especially specs, and then need to access the file the spec file is written for. So I wrote a vs code extension for it, of course. It is in a very basic, but usable, state. I hope to add more onto it and improve it as I go on.

## Features

This tool can open source files for ruby applications using standard structure with an app folder, lib folder, and a test folder (test folder can be "test" or "spec").

Use `ctrl+shift+P` to open the command thingy and type in the desired command. Like magic, the file will open.

You can open the source file for the current test file with `OpenSpec app file`.
You can open the test file for the current source file with `OpenSpec test file`.

## Extension Settings

None currently. :) 

## Known Issues

* ~~Only the `app/` folder specs are considered~~
* Really only supports rails with rspec and test with standard structure.
* The commands implement some odd language from legacy code.
* Opening tests for lib source files can take some time to actually open sometimes.
* I have noticed that after VS Code is first booted up, you can't open the test file for a source file... you have to open the source file for a test file first... seems silly, but I'm not entirely sure how to fix this at this point in time.

## Release Notes

### 0.1.4

* Fix version numbers because I'm a dumbbbb

### 0.1.2

* Added ability to work with structure that uses 'test' rather than 'spec' naming convention.
* Added ability to open test files for a given file in the app folder.
* Cleaned up accusatory language when users made mistakes.
* Added support for lib folder and it's specs.
* Did _not_ update the readme for about a month after release.
* Meowed at my cat because he is cute and meowing at me first.

### 0.0.1

* Added basic ability to open the file a spec references.

-----------------------------------------------------------------------------------------------------------

## Development

I will be more than happy to let other people help me out on this project; I have a few things I hope to hit at least before a full 1.0 release of the project.

### Near Term

* Support specs that describe a source file that is not in the `app/` folder.
* Figure out how to add a button for it on some bar. 
* Write tests for current code base lol

### Mid Term

* Vote for a congress person I agree with.
* Implement reverse support (open the spec file for a given ruby file.)
* Cry when my prefered candidate is beat because I live in TN and they have no chance ;_;
* Maybe have the reverse order create the spec file (and stub it as well) based on the file type and everything.... should be possible

### Long Term

* Support other ruby testing frameworks

### Ultra Long Term

* Support other language's frameworks. 

> Note: This is likely to change at any point, and new goals maybe added. I am doing this in my freetime for fun. :3
