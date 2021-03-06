
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
      {
        path: '/register/',
        url: 'register.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    alert('Hello');
})


$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$("#send-lg-btn").on("click",function(){
    var emailDelUser = $$("#lg-email").val();
    var passDelUser = $$("#lg-pass").val();
    
    firebase.auth().signInWithEmailAndPassword(emailDelUser, passDelUser)
    .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    
    console.log("Bienvenid@!!! " + emailDelUser);
    // ...
    })
    .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    
    console.error(errorCode);
        console.error(errorMessage);
    });
  })
})

      $$(document).on('page:init', '.page[data-name="register"]', function (e) {
        $$("#send-rg-btn").on("click",function(){
          var emailDelUser = $$("#rg-email").val();
          var passDelUser = $$("#rg-pass").val();


          firebase.auth().createUserWithEmailAndPassword(emailDelUser, passDelUser)
            .then((userCredential) => {
              // Signed in
              var user = userCredential.user;
              console.log("Bienvenid@!!! " + emailDelUser);
              // ...
              mainView.router.navigate('/siguientePantallaDeUsuarioOK/');
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;

              console.error(errorCode);
              console.error(errorMessage);

              if (errorCode == "auth/email-already-in-use") {
                  console.error("el mail ya esta usado");
              }

              // ..
            });
        })
      })