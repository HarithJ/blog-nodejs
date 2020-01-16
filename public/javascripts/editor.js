$(document).ready(() => {
  function saveData(httpMethod) {
    let editorData = {};

    editorData.blogPost = editor.getData();
    editorData.title = $('h1')[0].innerText;
    editorData.description = $('p')[0].innerText;
    if (editorData.description.length > 200) {
      editorData.description = editorData.description.slice(0, 200).trim();
      editorData.description += '...'
    }

    const url = window.location.href;

    $.ajax({
      url: url,
      type: httpMethod,
      data: editorData,
      success: (result) => {
        if (result.redirect) {
          window.location.href = result.redirect;
        }
      }
    });
  }

  let editor;
  BalloonEditor
    .create( document.querySelector( '#editor' ), {
      title: {
        placeholder: 'Title'
      },
      autosave: {
        waitingTime: 5000, // The minimum time period between two save actions
        save( editor ) {
          return saveData(editor.getData());
        }
      },
    })
    .then( newEditor => {
        editor = newEditor
    })
    .catch( error => {
        console.error( error );
    });

  $( '#publish' ).on('click', (e) => {
    e.preventDefault()
    saveData('POST');
  });

  $( '#save-and-publish' ).on('click', (e) => {
    e.preventDefault()
    saveData('PUT');
  });

});
