function tumbiliSubmitForm() {
	const form = document.getElementById( 'tumbili-form' );
	form.classList.toggle( 'isSubmitting' );

	const data = {};

	data.fname = document.getElementById( 'FNAME' ) ?
		document.getElementById( 'FNAME' ).value :
		'';
	data.lname = document.getElementById( 'LNAME' ) ?
		document.getElementById( 'LNAME' ).value :
		'';
	data.email = document.getElementById( 'tumbiliEmail' ) ?
		document.getElementById( 'tumbiliEmail' ).value :
		'';

	data.apikey = form.dataset.apikey;
	data.listID = form.dataset.listid;
	data.dc = form.dataset.apikey.split( '-' )[ 1 ];

	sendRequestViaAJAX( data );
}

function sendRequestViaAJAX( formData ) {
	jQuery.ajax( {
		url: tumbili.ajax_url,
		type: 'post',
		data: {
			action: 'tumbili_mailchimp_add_subscriber',
			formData,
		},
		success: function( response ) {
			alert( response );
		},
	} );
}

// function sendRequest( formData ) {
// 	const request = new XMLHttpRequest();

// 	const data = {
// 		email_address: formData.email,
// 		status: 'pending',
// 	};

// 	// data center
// 	const dataCenter = formData.apikey.split( '-' )[ 1 ];

// 	request.open(
// 		'POST',
// 		`https://${ dataCenter }.api.mailchimp.com/3.0/lists/${
// 			formData.listID
// 		}/members/`,
// 		true
// 	);
// 	request.setRequestHeader( 'Content-Type', 'application/json; charset=UTF-' );
// 	request.setRequestHeader(
// 		'Authorization',
// 		'Basic ' + btoa( 'user:' + formData.apikey )
// 	);
// 	request.send( data );
// }

window.onload = function() {
	document
		.getElementById( 'tumbili-form' )
		.addEventListener( 'submit', function( evt ) {
			evt.preventDefault();
			tumbiliSubmitForm();
		} );
};
