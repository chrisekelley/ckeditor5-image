/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals ClassicEditor, console, window, document */

import getToken from '@ckeditor/ckeditor5-easy-image/tests/_utils/gettoken';

getToken()
	.then( token => {
		ClassicEditor
			.create( document.querySelector( '#snippet-image-style' ), {
				toolbar: {
					viewportTopOffset: 60
				},
				cloudServices: { token }
			} )
			.then( editor => {
				window.editorStyle = editor;
			} );
	} )
	.catch( err => {
		console.error( err );
	} );
