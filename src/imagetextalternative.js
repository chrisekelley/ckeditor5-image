/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/imagetextalternative
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ImageTextAlternativeEngine from './imagetextalternative/imagetextalternativeengine';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import TextAlternativeFormView from './imagetextalternative/ui/textalternativeformview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import textAlternativeIcon from '@ckeditor/ckeditor5-core/theme/icons/low-vision.svg';
import { repositionContextualBalloon, getBalloonPositionData } from './image/ui/utils';
import { isImageWidgetSelected } from './image/utils';

import '../theme/imagetextalternative/theme.scss';

/**
 * The image text alternative plugin.
 *
 * The plugin uses the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageTextAlternative extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ImageTextAlternativeEngine, ContextualBalloon ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageTextAlternative';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		this._createButton();
		this._createForm();
	}

	/**
	 * Creates a button showing the balloon panel for changing the image text alternative and
	 * registers it in the editor {@link module:ui/componentfactory~ComponentFactory ComponentFactory}.
	 *
	 * @private
	 */
	_createButton() {
		const editor = this.editor;
		const command = editor.commands.get( 'imageTextAlternative' );
		const t = editor.t;

		editor.ui.componentFactory.add( 'imageTextAlternative', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Change image text alternative' ),
				icon: textAlternativeIcon,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );

			this.listenTo( view, 'execute', () => this._showForm() );

			return view;
		} );
	}

	/**
	 * Creates the {@link module:image/imagetextalternative/ui/textalternativeformview~TextAlternativeFormView}
	 * form.
	 *
	 * @private
	 */
	_createForm() {
		const editor = this.editor;
		const editingView = editor.editing.view;

		/**
		 * The contextual balloon plugin instance.
		 *
		 * @private
		 * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
		 */
		this._balloon = this.editor.plugins.get( 'ContextualBalloon' );

		/**
		 * A form containing a textarea and buttons, used to change the `alt` text value.
		 *
		 * @member {module:image/imagetextalternative/ui/textalternativeformview~TextAlternativeFormView} #form
		 */
		this._form = new TextAlternativeFormView( editor.locale );

		this.listenTo( this._form, 'submit', () => {
			editor.execute( 'imageTextAlternative', {
				newValue: this._form.labeledInput.inputView.element.value
			} );

			this._hideForm( true );
		} );

		this.listenTo( this._form, 'cancel', () => {
			this._hideForm( true );
		} );

		// Close the form on Esc key press.
		this._form.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideForm( true );
			cancel();
		} );

		// Reposition the balloon or hide the form if an image widget is no longer selected.
		this.listenTo( editingView, 'render', () => {
			if ( !isImageWidgetSelected( editingView.selection ) ) {
				this._hideForm( true );
			} else if ( this._isVisible ) {
				repositionContextualBalloon( editor );
			}
		}, { priority: 'low' } );

		// Close on click outside of balloon panel element.
		clickOutsideHandler( {
			emitter: this._form,
			activator: () => this._isVisible,
			contextElements: [ this._form.element ],
			callback: () => this._hideForm()
		} );
	}

	/**
	 * Shows the {@link #_form} in the {@link #_balloon}.
	 *
	 * @private
	 */
	_showForm() {
		if ( this._isVisible ) {
			return;
		}

		const editor = this.editor;
		const command = editor.commands.get( 'imageTextAlternative' );
		const labeledInput = this._form.labeledInput;

		if ( !this._balloon.hasView( this._form ) ) {
			this._balloon.add( {
				view: this._form,
				position: getBalloonPositionData( editor )
			} );
		}

		// Make sure that each time the panel shows up, the field remains in sync with the value of
		// the command. If the user typed in the input, then canceled the balloon (`labeledInput#value`
		// stays unaltered) and re-opened it without changing the value of the command, they would see the
		// old value instead of the actual value of the command.
		// https://github.com/ckeditor/ckeditor5-image/issues/114
		labeledInput.value = labeledInput.inputView.element.value = command.value || '';

		this._form.labeledInput.select();
	}

	/**
	 * Removes the {@link #_form} from the {@link #_balloon}.
	 *
	 * @param {Boolean} [focusEditable=false] Controls whether the editing view is focused afterwards.
	 * @private
	 */
	_hideForm( focusEditable ) {
		if ( !this._isVisible ) {
			return;
		}

		this._balloon.remove( this._form );

		if ( focusEditable ) {
			this.editor.editing.view.focus();
		}
	}

	/**
	 * Returns `true` when the {@link #_form} is the visible view
	 * in the {@link #_balloon}.
	 *
	 * @private
	 * @type {Boolean}
	 */
	get _isVisible() {
		return this._balloon.visibleView == this._form;
	}
}
