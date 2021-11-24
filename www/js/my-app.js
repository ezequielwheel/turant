
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
    {
      path: '/login/',
      url: 'index.html',
    },
    {
      path: '/main/',
      url: 'main.html',
    },
    {
      path: '/reg-negocio/',
      url: 'reg-negocio.html',
    },
    {
      path: '/exitolocal/',
      url: 'exitolocal.html',
    },
    {
      path: '/reservar/',
      url: 'reservar.html',
    },
    {
      path: '/prohibido/',
      url: 'prohibido.html',
    },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
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

var userEmail;

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$("#send-lg-btn").on("click", function () {
    var emailDelUser = $$("#lg-email").val();
    var passDelUser = $$("#lg-pass").val();

    firebase.auth().signInWithEmailAndPassword(emailDelUser, passDelUser)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        console.log("Bienvenid@!!! " + emailDelUser);
        // ...
        mainView.router.navigate('/main/');
        userEmail = emailDelUser;
        console.log(userEmail);
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
  $$("#send-rg-btn").on("click", function () {
    var emailDelUser = $$("#rg-email").val();
    var passDelUser = $$("#rg-pass").val();


    firebase.auth().createUserWithEmailAndPassword(emailDelUser, passDelUser)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log("Bienvenid@!!! " + emailDelUser);
        // ...
        mainView.router.navigate('/main/');
        userEmail = emailDelUser;
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

function toregister() {
  mainView.router.navigate('/register/');
}
function tologin() {
  mainView.router.navigate('/login/');
}
function tomain() {
  mainView.router.navigate('/main/');
}
function toreg() {
  mainView.router.navigate('/reg-negocio/');
}

var db = firebase.firestore();

function sendlocalbtn() {
  var localName = $$("#local-name").val();
  var localLocation = $$("#local-location").val();
  var localPic = $$("#local-pic").val();
  var localDesc = $$("#local-desc").val();
  var documento;
  db.collection("negocios").doc(userEmail + "-" + localName).set({
    email: userEmail,
    local: localName,
    ubicacion: localLocation,
    foto: localPic,
    descripcion: localDesc,
  });
  if(document. getElementById("local-name"). value. length == 0) {
    alert("Deben llenarse todos los campos")
  }else{
    if(document. getElementById("local-location"). value. length == 0) {
      alert("Deben llenarse todos los campos")
    }else{
      if(document. getElementById("local-pic"). value. length == 0) {
        alert("Deben llenarse todos los campos")
      }else{
        if(document. getElementById("local-desc"). value. length == 0){
          alert("Deben llenarse todos los campos")
        }else{
          mainView.router.navigate('/exitolocal/');
        }
      }
    }
  }
}

$$(document).on('page:init', '.page[data-name="main"]', function (e) {
  var contador=1;
  
  db.collection("negocios").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().foto);
      //$$(".swiper-wrapper").append(`<div class="swiper-slide"><img src="${doc.data().foto}"></div>`)
    if(contador<7){
      $$("#c" + contador).attr("src", doc.data().foto);
    contador++;
    }
      
    });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });
})

//$$(".ft").on("click",function() {
//  identification=this.id;
//  var imgsrc=$$("#"+identification).attr("src");
//  console.log(imgsrc);
//})

var descres
var fotores
var nameres
var ubires
var mail

function imgsrc(id) {
  console.log(id);
  var imgsrc=$$("#"+id).attr("src");
  console.log(imgsrc);
  db.collection("negocios").where("foto", "==", imgsrc)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            descres=doc.data().descripcion;
            fotores=doc.data().foto;
            nameres=doc.data().local;
            ubires=doc.data().ubicacion;
            mail=doc.data().email;
            mainView.router.navigate('/reservar/');
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

$$(document).on('page:init', '.page[data-name="reservar"]', function (e) {
  $$("#titleres").html(nameres);
  $$("#srcres").attr("src", fotores);
  $$("#descres").html(descres);
  $$("#ubicres").html(ubires);
})

function reservar() {
  var resName = $$("#res-name").val();
  var resHora = $$("#res-hora").val();
  var resCant = $$("#res-cant").val();
  var resObs = $$("#res-obs").val();
  var documento;
  db.collection("reservas").doc(nameres + "-" + resName).set({
    reserva: resName,
    hora: resHora,
    cantidad: resCant,
    observaciones: resObs,
  });
}

function verres() {
  if(userEmail==mail){
    mainView.router.navigate('/reservas/');
    console.log("pepe")
  }else{
    mainView.router.navigate('/prohibido/');
    console.log("asdsadsa")
  }
}