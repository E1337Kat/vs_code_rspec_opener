// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "openspecs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = [];
	disposable.push(vscode.commands.registerCommand('extension.openApps', () => {
		openAppFile();
	}));
	disposable.push(vscode.commands.registerCommand('extension.openSpecs', () => {
		openTestFile();
	}));

	context.subscriptions.push(disposable[0]);
	context.subscriptions.push(disposable[1]);
}

async function openAppFile() {
	let result;

	// Get the active Editor
	let active_editor = vscode.window.activeTextEditor;

  // if the active editor exists
	if (active_editor) {
		// We get the document URI of the current document.
		let active_uri = active_editor.document.uri;

		if (active_uri.fsPath.search(".rb") <= 0) {
			return Promise.resolve(false);
		}

		// We want to know what kind of test suite we are looking at, so we search
		// the uri for the notable identifier in the path. If there is at least
		// one instance of that, then we know we have our girl.
		if (active_uri.fsPath.search(/\/spec\//) >= 0) {
			result = process_spec_file(active_uri, 'spec');
		} else if (active_uri.fsPath.search(/\/test\//) >= 0) {
			result = process_spec_file(active_uri, 'test');
		} else {
			vscode.window.showInformationMessage('Hmmm, doesn\'t look like I can work wih this kind of file. :(');
			console.log('Tried to use with invalid test suite.\n' + active_uri.toString());
			result = Promise.resolve(false);
		}

		return result;

	} else {
		vscode.window.showInformationMessage("Hmm, doesn't look like this is a workspace. :(");
		return Promise.resolve(false);
	}
}

async function openTestFile() {
	// Get the active Editor
	let active_editor = vscode.window.activeTextEditor;

  // if the active editor exists
	if (active_editor) {
		// We get the document URI of the current document.
		let active_uri = active_editor.document.uri;

		if (active_uri.fsPath.search(".rb") <= 0) {
			return Promise.resolve(false);
		}


		return determineTestSuite()
			.then( (test_word) => {
				if (test_word === 'none') {
					vscode.window.showInformationMessage('Hmmm, doesn\'t look like I can work wih this kind of file. :(');
					console.log('Tried to use with invalid test suite.\n' + active_uri.toString());
					return Promise.resolve(false);
				} else if (test_word === 'test' || test_word === 'spec') {
					let result;
					if (active_uri.fsPath.search(/\/app\//) >= 0) {
						result = process_app_file(active_uri, test_word);
					} else if (active_uri.fsPath.search(/^((?!spec|test).)*lib\//) >= 0) {
						// only matches if lib is not preceded by the test folder.
						// It's crude, but should work.
						result = process_lib_file(active_uri, test_word);
					} else {
						vscode.window.showInformationMessage('Hmmm, doesn\'t look like this is an app file. :(');
						console.log('Tried to open non-source file as source file.\n' + active_uri.toString());
						result = Promise.resolve(false);
					}

					return result;
				} else {
					return Promise.resolve(false);
				}
			});
	} else {
		vscode.window.showInformationMessage("Hmmm, doesn't look like this is a workspace. :(");
		return Promise.resolve(false);
	}
}

/**
 * Finds files that use the general test suite, if found then returns test_keyword `test`,
 * otherwise checks if rspec file structure exists. If found, the test_keyword `spec` is
 * returned. In the case neither file structure exists, returns test_keyword `nope`.
 * 
 * @return A thenable that resolves to the appropriate test suite keyword or `nope` if neither.
 */
async function determineTestSuite() {
	return vscode.workspace.findFiles('**/test/**/*_test.rb', null, 1)
		.then( async (testy_results) => {
			if (testy_results.length < 1) {
				const specy_results = await vscode.workspace.findFiles('**/spec/**/*_spec.rb', null, 1);
				if (specy_results.length < 1) {
					return Promise.resolve('nope');
				}
				else {
					return Promise.resolve('spec');
				}
			}
			else {
				return Promise.resolve('test');
			}
		});
}

async function process_app_file(active_uri: vscode.Uri, test_keyword: String) {
	let path_elements = active_uri.toString().split('/');

	// build the app file's spec path
	let file_uri = build_test_file_path(path_elements, test_keyword, false);

	// Finally we can end this fucker and open the file... hope it works
	// we return true or false depending on the result.
	return await try_and_open_file(file_uri);
}

async function process_lib_file(active_uri: vscode.Uri, test_keyword: String) {
	let path_elements = active_uri.toString().split('/');

	// build the lib's spec file path
	let file_uri = build_test_file_path(path_elements, test_keyword, true);

	// Finally we can end this fucker and open the file... hope it works
	// we return true or false depending on the result.
	return await try_and_open_file(file_uri);
}

async function process_spec_file(active_uri: vscode.Uri, test_keyword: String) {
	// So we split the uri into an array using the forward slash as the delimiter.
	let path_elements = active_uri.toString().split('/');

	let lib = path_elements.includes('lib') ? true : false;
	
	// build the source file path
	let file_uri = build_source_file_path(path_elements, test_keyword, lib);

	// Finally we can end this fucker and open the file... hope it works
	// we return true or false depending on the result.
	return await try_and_open_file(file_uri);
}

function build_source_file_path(existing_path: Array<String>, test_keyword: String, library: Boolean) {

	// Aaaaand we search that array for an element 'spec'
	// when we do find it, we toss it and all elements before it away
	existing_path.forEach(function (element, index) {
		if (element === test_keyword) {
			let replacable = test_keyword.toString();
			let replacer = library ? 'lib' : 'app';
			if (library) {
				existing_path.splice(index + 1, 1);
			}
			existing_path[index] = existing_path[index].replace(replacable, replacer);
		}
	});

	// Grab path_length because is of great import
	let path_length = existing_path.length - 1;

	// Now we need to get the actual filename we are looking for. We know that the desired
	// filename's source will look something like `filename_controller.rb`. So we just add
	// in the '_spec' with nothing, and we are golden. We also remove the last element
	// having gotten the filename we need.
	let source_file = existing_path[path_length];
	existing_path = existing_path.slice(3, path_length);
	source_file = source_file.replace('_' + test_keyword, '');

	// Finally, we can build the path to the file we want to open. We build a file URI by joining
	// together all elements with a forward slash between each one. Lastly, we tack on the
	// end the name of the file we want.
	return vscode.Uri.file(existing_path.join('/') + '/' + source_file);
}

function build_test_file_path(existing_path: Array<String>, test_keyword: String, library: Boolean) {
	let path_type = library ? 'lib' : 'app';

	// We build a file URI by prepending '/spec/' to the existing relative path as needed
	existing_path.forEach(function (element, index) {
		if (element === path_type) {
			let replacable = path_type;
			let replacer = library ? [test_keyword.toString(), path_type].join('/') : test_keyword.toString();
			existing_path[index] = existing_path[index].replace(replacable, replacer);
		}
	});

	// Grab path_length because is of great import
	let path_length = existing_path.length - 1;

	// Now we need to get the actual filename we are looking for. 
	// We know that the desired filename's spec will look something 
	// like `filename_controller_spec.rb`. So we just replace
	// the '_spec' with nothing, and we are golden.
	// We also remove the last element having gotten the filename we need.
	let filename = existing_path[path_length];
	existing_path = existing_path.slice(3, path_length);

	// Build the spec file name by spliting around the `.` and then insert the correct file ending. 
	let file = filename.split('.');
	let test_file = file[0] + '_' + test_keyword + '.' + file[1];

	// Finally, we can build the path to the file we want to open. We build a file URI by joining
	// together all elements with a forward slash between each one. Lastly, we tack on the
	// end the name of the file we want.
	return vscode.Uri.file(existing_path.join('/') + '/' + test_file);
}

async function try_and_open_file(file_uri: vscode.Uri) {
	return await vscode.commands.executeCommand('vscode.open', file_uri).then(function() {
		return true;
	}, function() {
		return false;
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
