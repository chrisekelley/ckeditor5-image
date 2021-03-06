/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, console, window */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EnterPlugin from '@ckeditor/ckeditor5-enter/src/enter';
import TypingPlugin from '@ckeditor/ckeditor5-typing/src/typing';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '../../src/image';
import UndoPlugin from '@ckeditor/ckeditor5-undo/src/undo';
import ClipboardPlugin from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import ImageStyle from '../../src/imagestyle';
import ImageToolbar from '../../src/imagetoolbar';

ClassicEditor
	.create( document.querySelector( '#editor-semantic' ), {
		plugins: [
			ImageToolbar,
			EnterPlugin,
			TypingPlugin,
			ParagraphPlugin,
			HeadingPlugin,
			ImagePlugin,
			UndoPlugin,
			ClipboardPlugin,
			ImageStyle
		],
		toolbar: [ 'headings', 'undo', 'redo' ],
		image: {
			toolbar: [ 'imageStyleFull', 'imageStyleSide' ]
		}
	} )
	.then( editor => {
		window.editorSemantic = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );

ClassicEditor
	.create( document.querySelector( '#editor-formatting' ), {
		plugins: [
			ImageToolbar,
			EnterPlugin,
			TypingPlugin,
			ParagraphPlugin,
			HeadingPlugin,
			ImagePlugin,
			UndoPlugin,
			ClipboardPlugin,
			ImageStyle
		],
		toolbar: [ 'headings', 'undo', 'redo' ],
		image: {
			styles: [ 'imageStyleAlignLeft', 'imageStyleAlignCenter', 'imageStyleAlignRight' ],
			toolbar: [ 'imageStyleAlignLeft', 'imageStyleAlignCenter', 'imageStyleAlignRight' ]
		}
	} )
	.then( editor => {
		window.editorFormatting = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
