//
// DOM READY SCRIPT
//
var domIsReady = (function(domIsReady) {
  var isBrowserIeOrNot = function() {
    return (!document.attachEvent || typeof document.attachEvent === "undefined" ? 'not-ie' : 'ie');
  }

  domIsReady = function(callback) {
    if(callback && typeof callback === 'function'){
      if(isBrowserIeOrNot() !== 'ie') {
        document.addEventListener("DOMContentLoaded", function() {
          return callback();
        });
      } else {
        document.attachEvent("onreadystatechange", function() {
          if(document.readyState === "complete") {
            return callback();
          }
        });
      }
    } else {
      console.error('The callback is not a function!');
    }
  }

  return domIsReady;
})(domIsReady || {});

//
// DOM IS READY
//
(function(document, window, domIsReady, undefined) {
	domIsReady(function() {

		function tumbiliSubmitForm( evt ) {
			const form = evt.target;
			const loader = document.querySelector( '.tumbili-loader' );
			const data = {};

			data.fname = form.querySelector( '.tumbiliFName' ) ?
				form
					.querySelector( '.tumbiliFName' )
					.value :
				'';

			data.lname = form.querySelector( '.tumbiliLName' ) ?
				form
					.querySelector( '.tumbiliLName' )
					.value :
				'';

			data.email = form.querySelector( '.tumbiliEmail' ) ?
				form
					.querySelector( '.tumbiliEmail' )
					.value :
				'';

			data.apikey = form.dataset.apikey;
			data.listID = form.dataset.listid;
			data.dc = form.dataset.apikey.split( '-' )[ 1 ];

			sendRequestViaAJAX( data, form, loader );
		}

		function sendRequestViaAJAX( formData, form, loader ) {
				var data = 'action=tumbili_mailchimp_add_subscriber&formData[apikey]=' + formData.apikey + '&formData[listID]=' + formData.listID + '&formData[dc]=' + formData.dc + '&formData[fname]=' + formData.fname + '&formData[lname]=' + formData.lname + '&formData[email]=' + formData.email;

				var serialized_data = encodeURI( data );

				var xhr = new XMLHttpRequest();
				var url = tumbili.ajax_url;

				form.classList.toggle( 'isSubmitting' );
				loader.classList.toggle( 'is-hiding' );

				xhr.open( "POST", url, true);
				xhr.setRequestHeader( 'Accept', 'application/json, text/javascript, */*; q=0.01' );
				xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
				xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );

				xhr.responseType = 'json';
				xhr.onerror = function(){
		    	console.log( 'Error: Do something else...' );
				}
				xhr.onprogress = function () {
				  console.log( 'status:LOADING', xhr.status, ' STATE', xhr.readyState, ' RESPONSE', JSON.parse(xhr.response) );
				};
				xhr.onload = function ( response ) {
					if (this.status == 200) {
						form.classList.toggle( 'isSubmitting' );
						loader.classList.toggle( 'is-hiding' );
		    		console.log( 'status:DONE', xhr.status, ' STATE', xhr.readyState, 'NoParseResponse', this.response ); // JSON response
						var mailchimpResponse = this.response;
						showApiResult( mailchimpResponse );
		  		}
				};
				xhr.send( serialized_data );
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
				title =
					'🎉 You have subscribed. Please check your inbox for confirmation.';
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


		var docForms = document.querySelectorAll('form');
		var formTumbili = document.querySelectorAll('.tumbili-form');
		for (var i = 0; i < docForms.length; i++) {
			console.log('docForms[i]: ', docForms[i]);
			if ( docForms[i].classList.contains( 'tumbili-form' ) ) {
				console.log('tumbili-form!!!!');
				this.addEventListener( 'submit', function( evt ) {
					evt.preventDefault();
				 	tumbiliSubmitForm( evt );
		    } );
			}
		}


		if ( document.querySelector( '.tumbili-response' ) ) {
			document.querySelector( '.tumbili-response' ).onclick = function() {
				toggleForm();
			};
		}

	});
})(document, window, domIsReady);
