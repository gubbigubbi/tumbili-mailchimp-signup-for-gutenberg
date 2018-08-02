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
	let title;

	if ( response.status !== 200 ) {
		title = `Oops something wen't wrong: ${ response.title }`;
	} else {
		title = `${ response.title }`;
	}

	toggleForm( title );
}

function toggleForm( title = '' ) {
	const formContainer = document.querySelector( '.tumbili-container' );
	const responseContainer = document.querySelector( '.tumbili-response' );
	formContainer.classList.toggle( 'is-hiding' );
	responseContainer.classList.toggle( 'is-hiding' );
	responseContainer.innerHTML = title;
}

window.onload = function() {
	document.getElementById( 'tumbili-form' ).addEventListener( 'submit', evt => {
		evt.preventDefault();
		tumbiliSubmitForm();
	} );

	document.querySelector( '.tumbili-response' ).addEventListener( 'click', () => {
		toggleForm();
	} );
};
