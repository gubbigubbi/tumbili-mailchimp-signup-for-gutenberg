function tumbiliSubmitForm() {
	const form = document.getElementById( 'tumbili-form' );
	const loader = document.querySelector( '.tumbili-loader' );
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

	sendRequestViaAJAX( data, form, loader );
}

function sendRequestViaAJAX( formData, form, loader ) {
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
			loader.classList.toggle( 'is-hiding' );
		},
		success: response => {
			showApiResult( response );
		},
		complete: () => {
			form.classList.toggle( 'isSubmitting' );
			loader.classList.toggle( 'is-hiding' );
		},
	} );
}

function showApiResult( response ) {
	console.log( response );
	let title;

	if ( response.status === 400 ) {
		switch ( response.title ) {
			case 'Forgotten Email Not Subscribed':
				title =
					'Looks like you unsubscribed from this list previously, please contact us to resubscribe';
				break;
			case 'Member Exists':
				title = '😄 Looks you are already subscribed';
				break;
			default:
				title = `Oops something wen't wrong: ${ response.title }`;
		}
	} else {
		title = '🎉 You have subscribed. Please check your inbox for confirmation.';
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
