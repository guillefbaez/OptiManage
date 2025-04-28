 // Mostrar primer nombre en sidebar y header
 const firstName = sessionStorage.getItem('firstName');
 console.log('firstName from sessionStorage:', firstName);
 if (firstName) {
   document.getElementById('profileName').textContent =
     firstName;
 }