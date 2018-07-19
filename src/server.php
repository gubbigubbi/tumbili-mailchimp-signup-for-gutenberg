<?php
register_block_type('cgb/tumbili-mailchimp-for-gutenberg', array(
	'render_callback' => 'tumbili_render_callback',
		'attributes' => array(
			'formAction' => array(
				'type' 	=> 'string',
				'default' => '',
			),
			'showFirstName' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'showLastName' => array(
				'type' => 'boolean',
				'default' => false,
			),
		)
	)
);

/**
 * Server side rendering functions
 */
function tumbili_render_callback( array $attributes ){
	
	$formAction			= $attributes[ 'formAction' ];
	$showFirstName	= $attributes[ 'showFirstName' ];
	$showLastName 	= $attributes[ 'showLastName' ];

	$markup = '<div class="wp-block-cgb-tumbili-mailchimp-for-gutenberg">
	<div class="display-grid tumbili-grid">';


		$markup .= '
		<input type="email" name="email"/>
		<button type="submit">Submit</button>
		';
	

	return "{$markup}</div></div>";
}