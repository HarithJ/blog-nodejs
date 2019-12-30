$( '.navbar-nav a' ).on( 'click', function () {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	$( this ).parent( 'li' ).addClass( 'active' );
});

$(document).ready(() => {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	if (window.location.pathname === '/') {
		$('nav a:contains("Read")').parent( 'li' ).addClass( 'active' );
	}

	else if (window.location.pathname === '/users/login') {
		$('nav a:contains("Login")').parent( 'li' ).addClass( 'active' );
	}

	else if (window.location.pathname === '/users/register') {
		$('nav a:contains("Signup")').parent( 'li' ).addClass( 'active' );
	}

	$('#signupPassword').password({});
})
