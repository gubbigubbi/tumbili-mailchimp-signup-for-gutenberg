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
		)
	)
);

/**
 * Post to Mailchimp
 */
// TODO: Sanitize and switch to native wp http
add_action( 'wp_ajax_nopriv_tumbili_mailchimp_add_subscriber', 'tumbili_mailchimp_add_subscriber' );
add_action( 'wp_ajax_tumbili_mailchimp_add_subscriber', 'tumbili_mailchimp_add_subscriber' );

function tumbili_mailchimp_add_subscriber( ) {

	$formData = $_POST['formData'];

	$api_key    = $formData['apikey'];
	$datacenter = $formData['dc'];
	$list_id    = $formData['listID'];
	$errors = array();
	$data   = array();
	$first_name = $formData['fname'] ? $formData['fname'] : '';
	$last_name  = $formData['lname'] ? $formData['lname'] : '';
	$email      = $formData['email'];
	$status     = 'pending';
	// if ( !empty($_POST['status']) ) {
	// 		$status = $_POST['status'];
	// }
	$url = "https://{$datacenter}.api.mailchimp.com/3.0/lists/{$list_id}/members/";

	$auth = base64_encode( 'user:'.$api_key );

	$response = [];

	$data = array(
			'email_address' => $email,
			'status'        => $status,
			'merge_fields'  => array(
					'FNAME'     => $first_name,
					'LNAME'     => $last_name
			)
	);

	$response = json_encode(tumbili_fetchData($url, $data, $auth));
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
	
	$formAction			= $attributes[ 'formAction' ];
	$apiKey					= $attributes[ 'apiKey' ];
	$listID					= $attributes[ 'listID' ]		;
	$showFirstName	= $attributes[ 'showFirstName' ];
	$showLastName 	= $attributes[ 'showLastName' ];

	$firstName = '';
	$lastName = '';

	if($showFirstName) {
		$firstName .= '
		<div class="tumbili-form-control flex-grow">
			<label for="firstName">First Name<input name="firstName" id="FNAME" type="text"></label>
		</div>';
	}

	if($showLastName) {
		$lastName .= '
		<div class="tumbili-form-control flex-grow">
			<label for="lastName">Last Name<input name="lastName" id="LNAME" type="text"></label>
		</div>';
	}

	$markup = '<form id="tumbili-form" data-apikey="'.$apiKey.'" data-listid="'.$listID.'" action="'.$formAction.'" method="post" class="wp-block-cgb-tumbili-mailchimp-for-gutenberg">';
	
		$markup .= '<a class="tumbili-response will-animate is-hiding"></a>';
		$markup .= '<div class="display-flex tumbili-container will-animate">';

		$markup .= $firstName;
		$markup .= $lastName;

		$markup .= '
		<div class="tumbili-form-control flex-grow">
			<label for="email">Email<input id="tumbiliEmail" name="email" type="email"></label>
		</div>
		<div class="flex-grow flex-is-at-bottom tumbili-form-control">
			<button class="tumbili-submit" value="Submit" type="submit">
				<div class="tumbili-loader will-animate is-hiding">
				<div class="loader-inner ball-pulse-sync">
					<div></div>
					<div></div>
					<div></div>
				</div>
				</div>
				Submit
			</button>
		</div>


		';
	

	return "{$markup}</div></form></form>";
}