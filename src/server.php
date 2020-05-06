<?php
register_block_type('cgb/tumbili-mailchimp-for-gutenberg', array(
	'render_callback' => 'tumbili_render_callback',
		'attributes' => array(
			'formAction' => array(
				'type' 		=> 'string',
				'default' => '',
			),
			'apiKey' => array(
				'type' 		=> 'string',
				'default' => '',
			),
			'listID' => array(
				'type' 		=> 'string',
				'default' => '',
			),
			'showFirstName' => array(
				'type' 		=> 'boolean',
				'default' => false,
			),
			'showLastName' => array(
				'type' 		=> 'boolean',
				'default' => false,
			),
			'buttonColor' => array(
				'type' 		=> 'string',
				'default' => '',
			),
			'buttonBackground' => array(
				'type' 		=> 'string',
				'default' => '',
			),
			'fields'	=> array(
				'type'		=> 'array',
				'default' => []
			),
		)
	)
);

/**
 * Post to Mailchimp
 */
add_action( 'wp_ajax_nopriv_tumbili_mailchimp_add_subscriber', 'tumbili_mailchimp_add_subscriber' );
add_action( 'wp_ajax_tumbili_mailchimp_add_subscriber', 'tumbili_mailchimp_add_subscriber' );

// TODO: Could some of this data be passed with a render callback???
function tumbili_mailchimp_add_subscriber( ) {

	$formData = $_POST['formData'];

	// Sanitize data
	$api_key    = sanitize_key($formData['apikey']);
	$datacenter = sanitize_text_field($formData['dc']);
	$list_id    = sanitize_key($formData['listID']);
	$errors 		= array();
	$data   		= array();
	$first_name = $formData['fname'] ? sanitize_text_field($formData['fname']) : '';
	$last_name  = $formData['lname'] ? sanitize_text_field($formData['lname']) : '';
	$email      = sanitize_email($formData['email']);
	$status     = 'pending';
	// if ( !empty($_POST['status']) ) {
	// 		$status = $_POST['status'];
	// }

	$fields 		= $_POST['formCustomFields'];

	$mergeFields =  array(
		'FNAME'     	=> esc_attr($first_name),
		'LNAME'     	=> esc_attr($last_name)
	);

	if($fields) {		
		foreach($fields as $key => $field) {
			$fieldsArr[$key] = esc_attr($field);
		}

		$mergeFields = array_merge($mergeFields, $fieldsArr);	
	}
	
	$url = "https://{$datacenter}.api.mailchimp.com/3.0/lists/{$list_id}/members/";
	$auth = base64_encode( 'user:'.esc_attr($api_key) );
	$response = [];

	$data = array(
			'email_address' => esc_attr($email),
			'status'        => esc_attr($status),
			'merge_fields'	=> $mergeFields,
	);

	$response = json_encode(tumbili_fetchData(esc_attr($url), $data, $auth));
	echo $response;
	wp_die();
}

function tumbili_fetchData($url, $data, $auth) {

	$data_string = json_encode($data);

	$args = array(
		'method'	=> 'POST',
		'headers' => array(
			'Content-Type' 		=> 'application/json',
			'Content-Length'  => strlen($data_string),
			'Authorization' 	=> 'Basic '.$auth
		),
		'body'    => json_encode($data),
	); 

	$request = wp_remote_post( $url, $args);

	if(is_wp_error( $request )) { 
		return false;
	}

	return json_decode( $request['body'] );
}


/**
 * Server side rendering functions
 */
function tumbili_render_callback( array $attributes ){
	
	$formAction					= $attributes[ 'formAction' ];
	$apiKey							= $attributes[ 'apiKey' ];
	$listID							= $attributes[ 'listID' ]		;
	$showFirstName			= $attributes[ 'showFirstName' ];
	$showLastName 			= $attributes[ 'showLastName' ];
	$buttonBackground 	= $attributes[ 'buttonBackground' ];
	$buttonColor 				= $attributes[ 'buttonColor' ];
	$buttonText 				= $attributes[ 'buttonText' ];
	$labelColor 				= $attributes[ 'labelColor' ];
	$fields 						= $attributes[ 'fields' ];

	$firstName = '';
	$lastName = '';
	$fieldsHTML = '';

	if($showFirstName) {
		$firstName .= '
		<div class="tumbili-form-control flex-grow">
			<label for="firstName" style="color: '.$labelColor.'">First Name<input name="firstName" class="tumbiliFName" type="text"></label>
		</div>';
	}

	if($showLastName) {
		$lastName .= '
		<div class="tumbili-form-control flex-grow">
			<label for="lastName" style="color: '.$labelColor.'">Last Name<input name="lastName" class="tumbiliLName" type="text"></label>
		</div>';
	}

	foreach ($fields as $field) {

		$width = $field['fullWidth'] ? 'is-full-width' : '';
		
		$fieldsHTML .= '<div class="tumbili-form-control flex-grow '.$width.'"><label for="'.$field['value'].'" style="color: '.$labelColor.'">'.$field['label'];
		
		if( $field['type'] == 'text' ) {
			$fieldsHTML .= '<input name="'.$field['value'].'" class="tumbili-custom-field" type="text" data-type="'.$field['type'].'"></label>';
		} else {
			$fieldsHTML .= '<select name="'.$field['value'].'" class="tumbili-custom-field" data-type="'.$field['type'].'">';
			foreach($field['options'] as $option) {
				$fieldsHTML .= '<option value="'.$option['value'].'">'.$option['label'].'</option>';
			}
			$fieldsHTML .= '</select>';
		}
		$fieldsHTML .= '</label></div>';
	}

	$markup = '<form class="tumbili-form" id="tumbili-form-'.rand(0, 1000).'" data-apikey="'.$apiKey.'" data-listid="'.$listID.'" action="'.$formAction.'" method="post" class="wp-block-cgb-tumbili-mailchimp-for-gutenberg">';
	
		$markup .= '<a class="tumbili-response will-animate is-hiding"></a>';
		$markup .= '<div class="display-flex tumbili-container will-animate">';

		$markup .= $firstName;
		$markup .= $lastName;

		$markup .= '
		<div class="tumbili-form-control flex-grow">
			<label for="email" style="color: '.$labelColor.'">Email<input class="tumbiliEmail" name="email" type="email"></label>
		</div>'.$fieldsHTML.'
		<div class="flex-grow flex-is-at-bottom tumbili-form-control">
			<button style="background-color: '.$buttonBackground.'; color: '.$buttonColor.'; border-color: '.$buttonBackground.'" class="tumbili-submit" value="'.$buttonText.'" type="submit">
				<div class="tumbili-loader will-animate is-hiding">
				<div class="loader-inner ball-pulse-sync">
					<div></div>
					<div></div>
					<div></div>
				</div>
				</div>
				'.$buttonText.'
			</button>
		</div>
		';
	

	return "{$markup}</div></form></form>";
}