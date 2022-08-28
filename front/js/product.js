// variables pour insertion des infos article + ajout panier :
const itemImageTag = document.createElement('img');
const itemNameTag = document.getElementById('title');
const itemPriceTag = document.getElementById('price');
const itemDescriptionTag = document.getElementById('description');
const colorSelectTag = document.getElementById('colors');
const itemQuantityTag = document.getElementById('quantity');
const addToCartButton = document.getElementById('addToCart');

/**
 * La variable "url" récupère tous les paramètres de l'URL de la 
 * "product" en cours après le "?".
 * URLSearchParams.get(), récupére la variable "id" de l'URL.
 */
const url = window.location.search; // (?id=...)
const id = new URLSearchParams(url).get('id');

/**
 * requête API pour récupérer les infos de l'article avec son id :
 * réponse (res) transformée en JSON,
 * puis nouvelle réponse (data) devient 'itemSelected'.
 * si erreur, insère un message dans le DOM pour informer
 * l'utilisateur. La console indique aussi une erreur automatiquement.
 */
const apiRequestItem = async () => {
	await fetch(`http://localhost:3000/api/products/${id}`)
		.then((res) => res.json())
		.then((data) => (itemSelected = data))
		.catch((err) => {
			let error = document.querySelector('.item__content');
			error.style.fontSize = '1.7rem';
			error.textContent = 'Désolé, le site est indisponible pour le moment...';
		});
};

/**
 * crée et insère les éléments de l'article dans le DOM :
 * attente de la réponse de l'API avant
 * insertion (await):
 * 		- 'title' du document
 * 		- balise image + attribut 'src et 'alt'
 * 		- nom + prix + description
 * 		- Boucle "for of" choix de couleurs : pour chaque couleur du tableau
 * 	 "colorsTab" de couleurs de l'article, créer une option avec l'attribut
 *   "color" et y insèrer le texte de la couleur correspondante.
 * Puis appel de la fonction pour éxécution.
 */
const displayItem = async () => {
	await apiRequestItem();
	document.title = itemSelected.name;

	itemImageTag.src = itemSelected.imageUrl;
	itemImageTag.alt = itemSelected.altTxt;
	document.querySelector('.item__img').appendChild(itemImageTag);

	itemNameTag.textContent = itemSelected.name;
	itemPriceTag.textContent = itemSelected.price;
	itemDescriptionTag.textContent = itemSelected.description;

	let colorList = itemSelected.colors;
	for (let color of colorList) {
		const colorOptionTag = document.createElement('option');
		colorOptionTag.setAttribute('value', color);
		colorOptionTag.textContent = color;
		colorSelectTag.appendChild(colorOptionTag);
	}
};
displayItem();

/**
 * écoute au clic du bouton "ajouter au panier" :
 * 	- crée l'objet 'item' avec ses infos à stocker (id,qty, color).
 * 	- Puis appel de la fonction "checkCart()" de vérification input.
 * 	- Puis appel de la fonction "addCart()" d' ajout de l'article.
 */
addToCartButton.addEventListener('click', () => {
	let item = {
		id: id,
		color: colorSelectTag.value,
		qty: itemQuantityTag.value,
	};
	checkCart(item);
});

/**
 * vérifie si les coloris et quantités ne sont pas renseignés :
 * vérification sur l'article (item).
 * si le formulaire n'est pas complet, afficher un message.
 * si le formulaire est correct, éxécuter la fonction d'ajout au panier.
 */
const checkCart = (item) => {
	if (colorSelectTag.value == '' && quantity.value == 0) {
		alert('Veuillez choisir un coloris et une quantité, svp');
	} else if (colorSelectTag.value == '' && quantity.value !== 0) {
		alert('Veuillez choisir un coloris, svp');
	} else if (colorSelectTag.value !== '' && quantity.value == 0) {
		alert('Veuillez choisir une quantité, svp');
	} else if (quantity.value > 100) {
		alert('Veuillez choisir une quantité maximum de 100 articles, svp');
	} else {
		addCart(item);
	}
};

// stocke le panier (cartArray) dans le local storage en JSON :
const saveCart = (cartArray) => {
	localStorage.setItem('inCart', JSON.stringify(cartArray));
};

/**
 * ajout (item) au panier dans le local storage :
 * 1. récupèrer le panier du local storage traduit en objet.
 * 2. Vérifier si le panier existe et comprend déjà le même article :
 * 	a) si le panier n'existe pas (null), créer le tableau, y ajouter les
 * 	  articles et enregistrer dans le local storage.
 *	b) si le panier existe vérifier si un article de même id et couleur
 * 	  y est déjà présent avec .find() :
 * 		- si undefined = pas de doublon, ajouter l'article dans le
 * 	  panier et enregistrer dans le local storage.
 * 		- si déjà présent, incrémenter la nouvelle quantité et
 *    enregistrer dans le local storage.
 * 	c) si le panier existe sans article similaire : ajouter l'article
 * 	  dans le panier et enregistrer dans le local storage.
 * 3. afficher un message de confirmation au client.
 */
const addCart = (item) => {
	let cartArray = JSON.parse(localStorage.getItem('inCart'));
	if (cartArray == null) {
		cartArray = [];
		cartArray.push(item);
		saveCart(cartArray);
	} else {
		let foundItem = cartArray.find(
			(kanap) => kanap.id == item.id && kanap.color == item.color
		);
		if (foundItem != undefined) {
			foundItem.qty = parseInt(item.qty) + parseInt(foundItem.qty);
		} else {
			cartArray.push(item);
		}
		saveCart(cartArray);
	}
	alert(
		`${item.qty}` +
			' ' +
			`${itemSelected.name}` +
			' ' +
			`${item.color}` +
			' ajouté(s) à votre panier !'
	);
};
