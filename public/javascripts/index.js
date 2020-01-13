$(document).ready(() => {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );

	if (window.location.pathname === '/') {
		$('nav a:contains("Read")').parent( 'li' ).addClass( 'active' );
	}

	else if (window.location.pathname === '/users/login') {
		$('nav a:contains("Sign in")').parent( 'li' ).addClass( 'active' );
	}

	let postToDelUrl = '';
	let postTitle = '';
	$('a.delete-post').on('click', function (e) {
		e.preventDefault();

		postToDelUrl = $(this).attr("href");

		$('#delete-confirmation-modal').modal('show');
	});

	$('#delete-confirmation-modal').on('shown.bs.modal', function (e) {
		$('#deletion-confirmed').on('click', function (e) {
			$.ajax({
				url: postToDelUrl,
				type: 'DELETE',
				success: (result) => {
					if (result.redirect) {
            window.location.href = result.redirect;
          }
				}
			});
		});
	});

});
