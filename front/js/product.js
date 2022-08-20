/**
 *La variable "url" récupère tous les paramètres de l'URL de la page "product" en cours.
 *URLSearchParams.get, avec la variable "id", récupére l'id de l'URL.
 *requête fetch à l'API pour récupérer les données du produit, puis traitement de la promise brute en JSON.
 *Puis insertion des specifications du produit dans le code HTML.
 */
const url = window.location.search; // (?id=...)
const id = new URLSearchParams(url).get('id');

// variables pour insertion des infos produit(s) + ajout panier :
const productImg = document.createElement('img');
const productName = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const colorSelect = document.getElementById('colors');
const addToCartBtn = document.getElementById('addToCart');

// requête API pour récupérer les infos du produit identifié par son id :
const apiRequestProduct = async () => {
	await fetch(`http://localhost:3000/api/products/${id}`)
		.then((res) => res.json())
		.then((data) => (product = data))
		.catch((error) => {
			productName.style.fontSize = '2rem';
			productName.textContent =
				'Désolé, une erreur de chargement est survenue...';
		});
};

// fonction qui crée et insère les éléments du produit dans le DOM :
const displayProduct = async () => {
	await apiRequestProduct();
	// insertion 'title' du document :
	document.title = `${product.name}`;

	// balise image + attribut "alt" :
	productImg.src = product.imageUrl;
	productImg.alt = product.altTxt;
	document.querySelector('.item__img').appendChild(productImg);

	// nom, prix et description :
	productName.textContent = product.name;
	productPrice.textContent = product.price;
	productDescription.textContent = product.description;

	/* choix de couleurs : pour chaque couleur du tableau "colorsTab", créer une option avec l'attribut "color" et y insèrer le texte de la couleur correspondante, puis les insèrer dans la balise <select> */
	let colorList = product.colors;
	for (let color of colorList) {
		const colorOption = document.createElement('option');
		colorOption.setAttribute('value', color);
		colorOption.textContent = color;
		colorSelect.appendChild(colorOption);
	}
};
displayProduct();
