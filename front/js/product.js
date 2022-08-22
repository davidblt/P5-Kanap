// variables pour insertion des infos produit + ajout panier :
const productImg = document.createElement('img');
const productName = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const colorSelect = document.getElementById('colors');
const productQuantity = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');

/**
 * La variable "url" récupère tous les paramètres de l'URL de la page "product" * en cours après le ?.
 * URLSearchParams.get(), récupére la variable id de l'URL.
 */
const url = window.location.search; // (?id=...)
const id = new URLSearchParams(url).get('id');

/**
 * requête API pour récupérer les infos du produit avec id :
 * réponse (res) transformée en JSON,
 * puis nouvelle réponse (data) devient 'product'.
 * si erreur, insère un message dans le DOM pour informer
 * 'utilisateur. La console indique aussi une erreur.
 */
const apiRequestProduct = async () => {
	await fetch(`http://localhost:3000/api/products/${id}`)
		.then((res) => res.json())
		.then((data) => (product = data))
		.catch((err) => {
			let error = document.querySelector('.item__content');
			error.style.fontSize = '1.7rem';
			error.textContent = 'Désolé, le site est indisponible pour le moment...';
		});
};

/**
 * crée et insère les éléments du produit dans le DOM :
 * attente de la réponse de l'API avant
 * insertion (await):
 * 		- 'title' du document
 * 		- balise image + attribut 'alt'
 * 		- nom + prix + description
 * 		- choix de couleurs : pour chaque couleur du tableau
 * 	 "colorsTab", créer une option avec l'attribut "color" et y
 * 	 insèrer le texte de la couleur correspondante.
 * Puis appel de la fonction pour éxécution.
 */
const displayProduct = async () => {
	await apiRequestProduct();
	document.title = product.name;

	productImg.src = product.imageUrl;
	productImg.alt = product.altTxt;
	document.querySelector('.item__img').appendChild(productImg);

	productName.textContent = product.name;
	productPrice.textContent = product.price;
	productDescription.textContent = product.description;

	let colorList = product.colors;
	for (let color of colorList) {
		const colorOption = document.createElement('option');
		colorOption.setAttribute('value', color);
		colorOption.textContent = color;
		colorSelect.appendChild(colorOption);
	}
};
displayProduct();

/**
 * écoute au clic du bouton "ajouter au panier" :
 * créer l'objet 'item' contenant les infos produit à stocker.
 * appeler la fonction qui permet d'ajouter au local storage.
 */
addToCartBtn.addEventListener('click', () => {
	let item = {
		id: id,
		name: product.name,
		color: colorSelect.value,
		qty: productQuantity.value,
	};
	addCart(item);
});

// stocke le panier (cartArray) dans le local storage en JSON :
const saveCart = (cartArray) => {
	localStorage.setItem('added', JSON.stringify(cartArray));
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
	let cartArray = JSON.parse(localStorage.getItem('added'));
	if (cartArray == null) {
		cartArray = [];
		cartArray.push(item);
		saveCart(cartArray);
	} else {
		let foundItem = cartArray.find(
			(art) => art.id == item.id && art.color == item.color
		);
		if (foundItem != undefined) {
			foundItem.qty = Number(item.qty) + Number(foundItem.qty);
			saveCart(cartArray);
		} else {
			cartArray.push(item);
			saveCart(cartArray);
		}
	}
	alert(
		`${item.qty}` +
			' ' +
			`${product.name}` +
			' ' +
			`${item.color}` +
			' ajouté(s) à votre panier !'
	);
};
