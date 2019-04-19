# openspecs README

openspecs is a light tool to make it easier to write tests for your rspec using rails project. I find myself opening a lot of files especially specs, and then need to access the file the spec file is written for. So I wrote a vs code extension for it, of course. It is in a very basic, but usable, state. I hope to add more onto it and improve it as I go on.

## Features

When in an rspec file in the `spec/` folder of a project, you can use a command to open the related file in the `app/` folder. You simply do `ctrl+shift+P` and type in "OpenSpec app file". Like magic, the file will open.

> Note: I mention only the `app/` folder as when I wrote this in the hour I did, I didn't think about there being a `lib/` folder... Whoopsies. I'll get to it eventually.

## Extension Settings

None currently. :) 

## Known Issues

* Only the `app/` folder specs are considered
* Really only supports rails with rspec with standard structure.

## Release Notes

It was released. :3

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