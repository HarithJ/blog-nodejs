$(document).ready(() => {
  let editor;
  BalloonEditor
    .create( document.querySelector( '#editor' ), {
      title: {
        placeholder: 'Title'
      }
    } )
    .then( newEditor => {
        console.log( newEditor );
        editor = newEditor
    } )
    .catch( error => {
        console.error( error );
    } );

  const UrlOrigin = window.location.origin;
  $( '#publish' ).on('click', (e) => {
      e.preventDefault()

      let editorData = {};

      editorData.blogPost = editor.getData();
      editorData.title = $('h1')[0].innerText;
      editorData.description = $('p')[0].innerText;
      if (editorData.description.length > 200) {
        editorData.description = editorData.description.slice(0, 200).trim();
        editorData.description += '...'
      }

      const url = `${UrlOrigin}/write/`

      $.post(url, editorData, (data, status) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      });
  });

  const pathname = new RegExp('^\/posts\/.+\/edit');
  let prevTitle = '';
  console.log(window.location.pathname);
  if (pathname.test(window.location.pathname)) {
    console.log('test passed');
    prevTitle = $('h1')[0].innerText;
  }
  $( '#save-and-publish' ).on('click', (e) => {
      e.preventDefault()

      let editorData = {};

      editorData.blogPost = editor.getData();
      editorData.newTitle = $('h1')[0].innerText;
      editorData.description = $('p')[0].innerText;
      if (editorData.description.length > 200) {
        editorData.description = editorData.description.slice(0, 200).trim();
        editorData.description += '...'
      }

      const url = `${UrlOrigin}/posts/${prevTitle}/edit`

      $.ajax({
        url: url,
        type: 'PUT',
        data: editorData,
        success: (result) => {
          if (result.redirect) {
            window.location.href = result.redirect;
          }
        }
      });
  });

});
