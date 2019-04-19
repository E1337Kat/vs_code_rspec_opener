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
	let disposable = vscode.commands.registerCommand('extension.openSpecs', () => {
		// The code you place here will be executed every time your command is executed
		openSpecsFile();
	});

	context.subscriptions.push(disposable);
}

async function openSpecsFile() {
	let success;

	// Get the active Editor
	let active_editor = vscode.window.activeTextEditor;

  // if the active editor exists
	if (active_editor) {
		// We get the document URI of the current document.
		let active_uri = active_editor.document.uri;

		// We want to know if this is a ruby spec file, so we search
		// the uri for the notable '_spec.rb'. If there is at least
		// one instance of that, then we know we have our girl.
		if (active_uri.toString().search("_spec.rb") > 0) {

			// So we split the uri into an array using the forward slash as the delimiter.
			let path_elements = active_uri.toString().split('/');

			// Aaaaand we search that array for an element 'spec'
			// when we do find it, we toss it and all elements before it away
			let spec_ref = 0;
			path_elements.forEach(function (element, index) {
				if (element === 'spec') {
					path_elements[index] = path_elements[index].replace('spec', 'app');
					// path_elements = path_elements.slice(index + 1, path_elements.length);
				}
			});

			// Now we need to get the actual filename we are looking for. 
			// We know that the desired filename's spec will look something 
			// like `filename_controller_spec.rb`. So we just replace
			// the '_spec' with nothing, and we are golden.
			// We also remove the last element having gotten the filename we need.
			let refed_filename = path_elements[path_elements.length - 1];
			path_elements = path_elements.slice(3, path_elements.length - 1);
			refed_filename = refed_filename.replace('_spec', '');

			// Finally, we can build the path to the file we want to open. 
			// We build a file URI by prepending '/app/' then the path array 
			// which is joined together with a forward slash between each one.
			// and lastly tacking on the end the name of the file we want.
			let refed_file_uri = vscode.Uri.file(path_elements.join('/') + '/' + refed_filename);

			// Finally we can end this fucker and open the file... hope it works
			success = await vscode.commands.executeCommand('vscode.open', refed_file_uri);
		} else {
			vscode.window.showInformationMessage('Wow, you fucked up!\n' + active_uri.toString() + ' is not a valid rspec file. :(');
		}
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
