$( '.navbar-nav a' ).on( 'click', function () {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	$( this ).parent( 'li' ).addClass( 'active' );
});

$(document).ready(() => {
	$( '.navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	if (window.location.pathname === '/') {
		$('nav a:contains("Read")').parent( 'li' ).addClass( 'active' );
	}
})
