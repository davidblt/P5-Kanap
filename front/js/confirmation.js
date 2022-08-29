// Récupére le numéro de commande dans l'URL courante ("params" après "?") :
const url = window.location.search;
const orderIdFromUrl = new URLSearchParams(url).get('orderId');

// Insère le numéro de commande dans le DOM :
const orderIdTag = document.getElementById('orderId');
orderIdTag.textContent = orderIdFromUrl;

// Supprime le panier du local storage une fois le n° de commande affiché :
localStorage.clear();
