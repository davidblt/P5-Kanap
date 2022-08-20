/**
 * Requête asynchrone fetch() de type GET pour récupérer les données de l'API.
 * .then() : traitement des données brutes de la réponse pour les changer en objet JSON.
 * .then() : la nouvelle réponse (data) est renommée "productList".
 * .catch(): afficher un message en cas d'erreur au chargement de la page.
 */

// variable pour cibler la balise <section> avec l'id "items"
const items = document.getElementById('items');

// fonction asynchrone pour requêter l'api avec fetch() :
const apiRequestList = async () => {
	await fetch('http://localhost:3000/api/products')
		.then(res => res.json())
		.then((data) => (productList = data))
		.catch((error) => {
			items.style.fontSize = '2rem';
			items.textContent = 'Désolé, une erreur de chargement est survenue...';
		});
};

/* fonction asynchrone qui attend le résultat de la requête API ("await"), puis va créer les éléments HTML et les insérer dans le DOM pour chaque produit de la liste de produits (boucle "for of") retournée par la requête fetch() : */
const displayProducts = async () => {
	await apiRequestList();
	for (let product of productList) {
		let anchor = document.createElement('a');
		anchor.setAttribute('href', `./product.html?id=${product._id}`);
		items.appendChild(anchor);

		let article = document.createElement('article');
		anchor.appendChild(article);

		let image = document.createElement('img');
		image.setAttribute('src', product.imageUrl);
		image.setAttribute('alt', product.altTxt);
		article.appendChild(image);

		let title = document.createElement('h3');
		title.classList.add('productName');
		title.textContent = product.name;
		article.appendChild(title);

		let paragraph = document.createElement('p');
		paragraph.classList.add('productDescription');
		paragraph.textContent = product.description;
		article.appendChild(paragraph);
	}
};

// appel de la fonction pour afficher les produits :
displayProducts();
