BalloonEditor
            .create(document.querySelector( '#editor' ), {
              title: {
                placeholder: 'Title'
              }
            })
            .catch(error => {
                console.error( error );
            });
