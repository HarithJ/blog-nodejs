$(document).ready(() => {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );

	if (window.location.pathname === '/') {
		$('nav a:contains("Read")').parent( 'li' ).addClass( 'active' );
	}

	else if (window.location.pathname === '/users/login') {
		$('nav a:contains("Sign in")').parent( 'li' ).addClass( 'active' );
	}

	$('#signupPassword').password({});
})
