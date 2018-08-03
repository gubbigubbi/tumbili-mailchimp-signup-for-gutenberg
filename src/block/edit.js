//import Inspector from './inspector';
const { Component, Fragment } = wp.element;

const { InspectorControls, ColorPalette } = wp.editor;
const { PanelBody, PanelColor, TextControl, ToggleControl } = wp.components;

const { __ } = wp.i18n;

export default class mailchimpEdit extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		const {
			attributes: {
				showFirstName,
				showLastName,
				apiKey,
				listID,
				buttonBackground,
				buttonColor,
			},
			className,
			setAttributes,
		} = this.props;

		let firstNameInput;

		if ( showFirstName ) {
			firstNameInput = (
				<div className="tumbili-form-control flex-grow">
					<label htmlFor="firstName">
						First Name
						<input name="firstName" type="text" />
					</label>
				</div>
			);
		}

		let lastNameInput;

		if ( showLastName ) {
			lastNameInput = (
				<div className="tumbili-form-control flex-grow">
					<label htmlFor="lasttName">
						Last Name
						<input name="lastName" type="text" />
					</label>
				</div>
			);
		}

		const button = (
			<input
				style={ { color: buttonColor, background: buttonBackground } }
				className="tumbili-submit"
				type="submit"
				value="Submit"
			/>
		);

		let container;

		if ( apiKey && listID ) {
			container = (
				<div className="display-flex tumbili-container">
					{ firstNameInput }
					{ lastNameInput }
					<div className="tumbili-form-control flex-grow">
						<label htmlFor="email">
							Email
							<input name="email" type="email" />
						</label>
					</div>
					<div className="tumbili-form-control flex-grow flex-is-at-bottom">
						{ button }
					</div>
				</div>
			);
		} else {
			container = (
				<div className={ className }>
					To get started please add an API Key & List ID.
				</div>
			);
		}

		return (
			<div className={ className }>
				<InspectorControls>
					<PanelBody title={ __( 'Form Options' ) }>
						<TextControl
							label={ __( 'Mailchimp API Key' ) }
							value={ apiKey }
							onChange={ apiKey => setAttributes( { apiKey } ) }
						/>
						<TextControl
							label={ __( 'Mailchimp List ID' ) }
							value={ listID }
							onChange={ listID => setAttributes( { listID } ) }
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
						<PanelColor
							title={ __( 'Button Background Color' ) }
							colorValue={ buttonBackground }
						>
							<ColorPalette
								value={ buttonBackground }
								onChange={ buttonBackground =>
									setAttributes( { buttonBackground } )
								}
							/>
						</PanelColor>
						<PanelColor
							title={ __( 'Button Text Color' ) }
							colorValue={ buttonColor }
						>
							<ColorPalette
								value={ buttonColor }
								onChange={ buttonColor => setAttributes( { buttonColor } ) }
							/>
						</PanelColor>
					</PanelBody>
				</InspectorControls>
				{ container }
			</div>
		);
	}
}
