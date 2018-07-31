function tumbiliSubmitForm() {
	const form = document.getElementById( 'tumbili-form' );
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

	sendRequestViaAJAX( data, form );
}

function sendRequestViaAJAX( formData, form ) {
	jQuery.ajax( {
		url: tumbili.ajax_url,
		type: 'post',
		data: {
			action: 'tumbili_mailchimp_add_subscriber',
			formData,
		},
		dataType: 'json',
		beforeSend: () => {
			form.classList.toggle( 'isSubmitting' );
		},
		success: response => {
			showApiResult( response );
		},
		complete: () => {
			form.classList.toggle( 'isSubmitting' );
		},
	} );
}

function showApiResult( response ) {
	console.log( response );
	console.log( typeof response );

	const formContainer = document.querySelector( '.tumbili-container' );
	formContainer.classList.add( 'is-hiding' );

	formContainer.insertAdjacentHTML(
		'afterend',
		`<div class="tumbili-response is-shown">${ response.title }</div>`
	);
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
