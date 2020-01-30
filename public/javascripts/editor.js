$(document).ready(() => {
  let isDirty = false;
  let postUuid = '';

  function getPostData( editor ) {
    let editorData = {};

    editorData.blogPost = editor.getData();
    editorData.title = $('h1')[0].innerText;
    editorData.description = $('p')[0].innerText;
    if (editorData.description.length > 200) {
      editorData.description = editorData.description.slice(0, 200).trim();
      editorData.description += '...'
    }

    return editorData;
  }

  BalloonEditor
    .create( document.querySelector( '#editor' ), {
      title: {
        placeholder: 'Title'
      },
    })
    .then( editor => {
        window.editor = editor;

        handleStatusChanges( editor );
        handleSaveButton( editor );
        handleBeforeunload( editor );
        setInterval(() => { console.log("After one min");handleAutoSave( editor ) }, 10000);
    })
    .catch( error => {
        console.error( error );
    });

  function handleAutoSave( editor ) {
    if ( isDirty ) {
      const pendingActions = editor.plugins.get( 'PendingActions' );
      const postData = getPostData(editor);
      postData.publish = false;

      const action = pendingActions.add( 'Saving changes' );

      let reqMethod = '';
      let reqUrl = '';

      // If we are editing the post, then we send a PUT request to the same
      // location
      if ( window.location.pathname.includes('edit') ) {
        reqMethod = 'PUT';
        reqUrl = window.location.href;
      }

      // Else we check if postUuid variable is empty, then it means we are
      // auto-saving the post for the second time, thus we send a POST request
      // to the same route (/write).
      else if ( postUuid === '' ) {
        reqMethod = 'POST';
        reqUrl = window.location.href;
      }

      // Else, we send a PUT req to the post's edit route
      else {
        reqMethod = 'PUT';
        reqUrl = `/posts/${postUuid}/edit`;
      }

      $.ajax({
        url: reqUrl,
        type: reqMethod,
        data: postData,
        success: (result) => {
          pendingActions.remove( action );
          // Reset isDirty only if the data did not change in the meantime.
          if ( postData.blogPost == editor.getData() ) {
            isDirty = false;
          }

          if (result.postUuid) {
            postUuid = result.postUuid
          }

          updateStatus( editor );
        }
      })
    }
  }

  function handleSaveButton( editor ) {
    const pendingActions = editor.plugins.get( 'PendingActions' );

    $( '#save-and-publish' ).on('click', (e) => {
      const postData = getPostData(editor);
      postData.publish = true;

      const action = pendingActions.add( 'Saving changes' );

      e.preventDefault();

      reqMethod = 'PUT';
      reqUrl = window.location.href;
      $.ajax({
        url: reqUrl,
        type: reqMethod,
        data: postData,
        success: (result) => {
          pendingActions.remove( action );
          // Reset isDirty only if the data did not change in the meantime.
          if ( postData.blogPost == editor.getData() ) {
            isDirty = false;
          }

          updateStatus( editor );

          if (result.redirect) {
            window.location.href = result.redirect;
          }
        }
      });
    });

    $( '#publish' ).on('click', (e) => {
      const postData = getPostData(editor);
      postData.publish = true;

      const action = pendingActions.add( 'Saving changes' );

      e.preventDefault();

      /*
        if postUuid variable is not empty, then it means we are saving the
        post for the second time (the first time it has been saved as a draft
        via the autosave function), thus we send a PUT request to the post's edit
        url. Else, we send a POST req to the same route (/write) and get the
        post's UUID.
      */
      let reqMethod = '';
      let reqUrl = '';
      if ( postUuid === '' ) {
        reqMethod = 'POST';
        reqUrl = window.location.href;
      }
      else {
        reqMethod = 'PUT';
        reqUrl = `/posts/${postUuid}/edit`;
      }

      $.ajax({
        url: reqUrl,
        type: reqMethod,
        data: postData,
        success: (result) => {
          pendingActions.remove( action );
          // Reset isDirty only if the data did not change in the meantime.
          if ( postData.blogPost == editor.getData() ) {
            isDirty = false;
          }

          updateStatus( editor );

          if (result.redirect) {
            window.location.href = result.redirect;
          }
        }
      });
    });
  }

  // Listen to new changes (to enable the "Save" button) and to
  // pending actions (to show the spinner animation when the editor is busy).
  function handleStatusChanges( editor ) {
    const pendingActions = editor.plugins.get( 'PendingActions' );

    pendingActions.on( 'change:hasAny', () => updateStatus( editor ) );

    editor.model.document.on( 'change:data', () => {
        isDirty = true;

        updateStatus( editor );
    } );
  }

  // If the user tries to leave the page before the data is saved, ask
  // them whether they are sure they want to proceed.
  function handleBeforeunload( editor ) {
      const pendingActions = editor.plugins.get( 'PendingActions' );

      window.addEventListener( 'beforeunload', evt => {
          if ( pendingActions.hasAny || isDirty ) {
              evt.preventDefault();
              event.returnValue = '';
          }
      });
  }

  function updateStatus( editor ) {
      const statusIndicator = document.querySelector( '#editor-status' );

      if ( editor.plugins.get( 'PendingActions' ).hasAny || isDirty ) {
        statusIndicator.innerText = 'Saving...';
      } else {
        statusIndicator.innerText = 'Saved';
      }
  }

});
