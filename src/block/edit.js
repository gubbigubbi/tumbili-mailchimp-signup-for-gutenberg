//import Inspector from './inspector';
const { Component } = wp.element;

const { InspectorControls } = wp.editor;
const { PanelBody, TextControl, ToggleControl } = wp.components;

const { __ } = wp.i18n;

export default class mailchimpEdit extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		const {
			attributes: { formAction, showFirstName, showLastName },
			className,
			setAttributes,
		} = this.props;

		let firstNameInput;

		if ( showFirstName ) {
			firstNameInput = (
				<input className="flex-grow" name="firstName" type="text" />
			);
		}

		let lastNameInput;

		if ( showLastName ) {
			lastNameInput = (
				<input className="flex-grow" name="lastName" type="text" />
			);
		}

		let container;

		if ( formAction ) {
			container = (
				<form className="display-flex tumbili-container" action={ formAction }>
					<input className="flex-grow" name="email" type="email" />
					{ firstNameInput }
					{ lastNameInput }
					<input className="flex-grow" type="submit" value="Submit" />
				</form>
			);
		} else {
			container = (
				<div className={ className }>
					To get started please add an Action URL.
				</div>
			);
		}

		return (
			<div className={ className }>
				<InspectorControls>
					<PanelBody title={ __( 'Form Options' ) }>
						<TextControl
							label={ __( 'Mailchimp Form URL' ) }
							value={ formAction }
							onChange={ formAction => setAttributes( { formAction } ) }
						/>
						<ToggleControl
							label={ __( 'Show First Name?' ) }
							checked={ showFirstName }
							onChange={ showFirstName => setAttributes( { showFirstName } ) }
						/>
						<ToggleControl
							label={ __( 'Show Last Name?' ) }
							checked={ showLastName }
							onChange={ showLastName => setAttributes( { showLastName } ) }
						/>
					</PanelBody>
				</InspectorControls>
				{ container }
			</div>
		);
	}
}
