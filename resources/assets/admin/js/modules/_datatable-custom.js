
$('.dataTable')
    .on( 'init.dt', function () {
        console.log( 'Table initialisation complete: '+new Date().getTime() );
    } )
    .dataTable();
