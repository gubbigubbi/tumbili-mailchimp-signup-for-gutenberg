//import Inspector from './inspector';
const { Component } = wp.element;

const { InspectorControls, PanelColorSettings } = wp.editor;
const {
	PanelBody,
	TextControl,
	ToggleControl,
	Button,
	SelectControl,
	Icon,
} = wp.components;

const { __ } = wp.i18n;

export default class mailchimpEdit extends Component {
	constructor() {
		super(...arguments);

		this.state = {
			newFieldLabel: "",
			newFieldValue: "",
			newFieldType: "text",
			newFieldFullWidth: false,
			newFieldOptions: [],
			newFieldOptionLabel: "",
		};
	}

	addField = () => {
		const newField = {
			label: this.state.newFieldLabel,
			value: this.state.newFieldValue,
			type: this.state.newFieldType,
			options: this.state.newFieldOptions,
			fullWidth: this.state.newFieldFullWidth,
		};

		if (!newField.label && !newField.value) {
			alert("Please add a label and MERGE tag first");
			return false;
		}

		this.props.setAttributes({
			fields: this.props.attributes.fields.concat(newField),
		});

		this.setState({
			newFieldLabel: "",
			newFieldValue: "",
			newFieldOptions: [],
			newFieldOptionLabel: "",
			newFieldFullWidth: false,
		});
	};

	addFieldOption = () => {
		const newOption = {
			label: this.state.newFieldOptionLabel,
		};

		this.setState({
			newFieldOptions: this.state.newFieldOptions.concat(newOption),
			newFieldOptionLabel: "", // effectively reset the form
		});
	};

	removeField = (index) => {
		const newFields = this.props.attributes.fields.filter((item, i) => {
			return i !== index;
		});

		this.props.setAttributes({
			fields: newFields,
		});
	};

	removeFieldOption = (index) => {
		const newOptions = this.state.newFieldOptions.filter((item, i) => {
			return i !== index;
		});

		this.setState({
			newFieldOptions: newOptions,
		});
	};

	onReorder = (type = "options", list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		if (type === "options") {
			this.setState({
				newFieldOptions: result,
			});
		} else {
			this.props.setAttributes({
				fields: result,
			});
		}
	};

	render() {
		const {
			attributes: {
				showFirstName,
				showLastName,
				apiKey,
				listID,
				buttonBackground,
				buttonColor,
				fields,
				buttonText,
				labelColor,
			},
			className,
			setAttributes,
		} = this.props;

		const {
			newFieldLabel,
			newFieldValue,
			newFieldType,
			newFieldOptionLabel,
			newFieldFullWidth,
		} = this.state;

		let firstNameInput;

		if (showFirstName) {
			firstNameInput = (
				<div className="tumbili-form-control flex-grow">
					<label htmlFor="firstName" style={{ color: labelColor }}>
						First Name
						<input name="firstName" type="text" />
					</label>
				</div>
			);
		}

		let lastNameInput;

		if (showLastName) {
			lastNameInput = (
				<div className="tumbili-form-control flex-grow">
					<label htmlFor="lasttName" style={{ color: labelColor }}>
						Last Name
						<input name="lastName" type="text" />
					</label>
				</div>
			);
		}

		const button = (
			<input
				style={{ color: buttonColor, background: buttonBackground }}
				className="tumbili-submit"
				type="submit"
				value={buttonText}
			/>
		);

		const fieldsHTML = fields.map((f, index) => {
			const widthClass = f.fullWidth ? "is-full-width" : "";

			const input =
				f.type === "text" ? (
					<input name={f.value} type="text" />
				) : (
					<select name={f.value}>
						<option value={f.options[0].label}>{f.options[0].label}</option>
					</select>
				);

			const up =
				index > 0 ? (
					<span
						onClick={() =>
							this.onReorder(
								"fields",
								this.props.attributes.fields,
								index,
								index - 1
							)
						}
					>
						<Icon icon="arrow-up"></Icon>
					</span>
				) : (
					""
				);

			const down =
				index < fields.length - 1 ? (
					<span
						onClick={() =>
							this.onReorder(
								"fields",
								this.props.attributes.fields,
								index,
								index + 1
							)
						}
					>
						<Icon icon="arrow-down"></Icon>
					</span>
				) : (
					""
				);

			return (
				<div
					key={index}
					className={"tumbili-form-control flex-grow " + widthClass}
				>
					<label htmlFor={f.value} style={{ color: labelColor }}>
						{f.label}
						{input}
					</label>
					<div className="tumbili-field-action">
						{up}
						{down}

						<span onClick={() => this.removeField(index)}>
							<Icon icon="dismiss" />
						</span>
					</div>
				</div>
			);
		});

		let container;

		if (apiKey && listID) {
			container = (
				<div className="display-flex tumbili-container">
					{firstNameInput}
					{lastNameInput}
					<div className="tumbili-form-control flex-grow">
						<label htmlFor="email" style={{ color: labelColor }}>
							Email
							<input name="email" type="email" />
						</label>
					</div>

					{fieldsHTML}

					<div className="tumbili-form-control flex-grow flex-is-at-bottom">
						{button}
					</div>
				</div>
			);
		} else {
			container = (
				<div className={className}>
					To get started please add an API Key & List ID.
				</div>
			);
		}

		let newFieldOptionHTML;

		if (newFieldType === "select") {
			const fieldOptions = this.state.newFieldOptions.map((option, index) => {
				return (
					<div key={index} className="tumbili-field-option">
						<span>{option.label}</span>
						<div>
							<span
								onClick={() =>
									this.onReorder(
										"options",
										this.state.newFieldOptions,
										index,
										index - 1
									)
								}
							>
								<Icon icon="arrow-up"></Icon>
							</span>
							<span
								onClick={() =>
									this.onReorder(
										"options",
										this.state.newFieldOptions,
										index,
										index + 1
									)
								}
							>
								<Icon icon="arrow-down"></Icon>
							</span>
							<span onClick={() => this.removeFieldOption(index)}>
								<Icon icon="dismiss" />
							</span>
						</div>
					</div>
				);
			});

			newFieldOptionHTML = (
				<div className="tumbili-type-options">
					<TextControl
						label="Option"
						value={newFieldOptionLabel}
						onChange={(label) => this.setState({ newFieldOptionLabel: label })}
					/>
					<Button isOutline isSmall onClick={this.addFieldOption}>
						Add Option
					</Button>

					{fieldOptions}
				</div>
			);
		}

		return (
			<div className={className}>
				<InspectorControls>
					<PanelBody title={__("Form Options")}>
						<TextControl
							label={__("Mailchimp API Key")}
							value={apiKey}
							onChange={(apiKey) => setAttributes({ apiKey })}
						/>
						<TextControl
							label={__("Mailchimp List ID")}
							value={listID}
							onChange={(listID) => setAttributes({ listID })}
						/>
						<ToggleControl
							label={__("Show First Name?")}
							checked={showFirstName}
							onChange={(showFirstName) => setAttributes({ showFirstName })}
						/>
						<ToggleControl
							label={__("Show Last Name?")}
							checked={showLastName}
							onChange={(showLastName) => setAttributes({ showLastName })}
						/>

						<PanelColorSettings
							title={__("Color Settings")}
							colorSettings={[
								{
									value: buttonBackground,
									onChange: (buttonBackground) =>
										setAttributes({ buttonBackground }),
									label: __("Button Background Color"),
								},
								{
									value: buttonColor,
									onChange: (buttonColor) => setAttributes({ buttonColor }),
									label: __("Button Text Color"),
								},
								{
									value: labelColor,
									onChange: (labelColor) => setAttributes({ labelColor }),
									label: __("Field Label Color"),
								},
							]}
						/>

						<TextControl
							label={__("Submit Text")}
							value={buttonText}
							onChange={(buttonText) => setAttributes({ buttonText })}
						/>
					</PanelBody>

					<PanelBody title={__(" Custom Fields ")}>
						<TextControl
							label="Field label"
							value={newFieldLabel}
							onChange={(label) => this.setState({ newFieldLabel: label })}
						/>

						<TextControl
							label="*|MERGE|* Tag"
							value={newFieldValue}
							help={__(
								"the *|MERGE|* tag value corresponding with that field, in your MailChimp audience"
							)}
							onChange={(label) => this.setState({ newFieldValue: label })}
						/>

						<ToggleControl
							label="Full width"
							checked={newFieldFullWidth}
							onChange={() =>
								this.setState((state) => ({
									newFieldFullWidth: !state.newFieldFullWidth,
								}))
							}
						/>

						<SelectControl
							label="Field type (more coming soon)"
							value={newFieldType}
							options={[
								{ label: "Text", value: "text" },
								{ label: "Select", value: "select" },
							]}
							onChange={(newFieldType) => {
								this.setState({ newFieldType });
							}}
						/>

						{newFieldOptionHTML}

						<Button isDefault onClick={this.addField}>
							Add Custom Field
						</Button>
					</PanelBody>
				</InspectorControls>
				{container}
			</div>
		);
	}
}
