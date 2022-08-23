// récupére le panier traduit en objet JavaScript :
const cartArray = JSON.parse(localStorage.getItem('added'));

// variables sélecteurs éléments HTML :
const section = document.getElementById('cart__items');

// fonction quantité totale d'articles dans le panier :
const totalQuantity = () => {
	let totalQuantity = document.getElementById('totalQuantity');
	let quantitiesItem = document.querySelectorAll('.itemQuantity');
	let totalQuantities = 0;
	quantitiesItem.forEach((qty) => {
		totalQuantities += Number(qty.value);
	});
	return (totalQuantity.textContent = totalQuantities);
};

// fonction calcul du prix total du panier :
const totalPrice = () => {
	let totalPrice = document.getElementById('totalPrice');
	let price = document.querySelectorAll('.price');
	let total = 0;
	price.forEach((price) => {
		total += parseInt(price.textContent);
	});
	return (totalPrice.innerHTML = total);
};

// fonction affiche message si le panier est vide :
const emptyCart = () => {
	let title = document.createElement('h2');
	title.style.textAlign = 'center';
	title.style.fontSize = '2rem';
	title.textContent = ' 😕  Votre panier est vide...';
	section.appendChild(title);
};

/**
 * Affichage des articles du panier :
 * fetch() pour récupérer les données produit de l'API, puis :
 * - si le panier est vide, insérer un message dans le DOM + alert() au
 * clic du bouton commander.
 * - si non vide, boucle 'for in' pour chaque clé [item] du tableau
 * (cartArray), récupérer la propriété id, color ou qty.
 * Récupérer name, price qui ne sont pas dans item, avec itemData du
 * fetch() qui ne récupère que les articles identifiés dans le tableau
 * cartArray.
 * => pour chaque article dans le panier, créer et insérer les éléments
 * HTML dans le DOM.
 */
const displayCartItems = async () => {
	if (cartArray == null) {
		emptyCart();
		orderBtn.addEventListener('click', () => {
			alert('Votre panier est vide...');
		});
	} else {
		for (let item in cartArray) {
			await fetch('http://localhost:3000/api/products/' + cartArray[item].id)
				.then((res) => res.json())
				.then((data) => (itemData = data))
				.catch((err) => {
					let error = document.querySelector('.item__content');
					error.style.fontSize = '1.7rem';
					error.textContent =
						'Désolé, le site est indisponible pour le moment...';
				});

			// Création + insertion des éléments HTML :
			let article = document.createElement('article');
			article.classList.add('cart__item');
			article.setAttribute('data-id', `${cartArray[item].id}`);
			article.setAttribute('data-color', `${cartArray[item].color}`);
			section.appendChild(article);

			let divImg = document.createElement('div');
			divImg.classList.add('cart__item__img');
			article.appendChild(divImg);

			let img = document.createElement('img');
			img.src = itemData.imageUrl;
			img.alt = itemData.altTxt;
			divImg.appendChild(img);

			let divContent = document.createElement('div');
			divContent.classList.add('cart__item__content');
			article.appendChild(divContent);

			let divDescription = document.createElement('div');
			divDescription.classList.add('cart__item__content__description');
			divContent.appendChild(divDescription);

			let title = document.createElement('h2');
			title.textContent = itemData.name;
			divDescription.appendChild(title);

			let color = document.createElement('p');
			color.textContent = cartArray[item].color;
			divDescription.appendChild(color);

			let price = document.createElement('p');
			price.classList.add('price');
			let totalItemPrice = cartArray[item].qty * itemData.price;
			price.textContent = totalItemPrice + ' €';
			divDescription.appendChild(price);

			let divSettings = document.createElement('div');
			divSettings.classList.add('cart__item__content__settings');
			article.appendChild(divSettings);

			let divQuantity = document.createElement('div');
			divQuantity.classList.add('cart__item__content__settings__quantity');
			divSettings.appendChild(divQuantity);

			let quantity = document.createElement('p');
			quantity.textContent = 'Qté : ';
			divQuantity.appendChild(quantity);

			let input = document.createElement('input');
			input.setAttribute('type', 'number');
			input.classList.add('itemQuantity');
			input.setAttribute('name', 'itemQuantity');
			input.setAttribute('min', '1');
			input.setAttribute('max', '100');
			input.setAttribute('value', cartArray[item].qty);
			divSettings.appendChild(input);

			let divDelete = document.createElement('div');
			divDelete.classList.add('cart__item__content__settings__delete');
			divSettings.appendChild(divDelete);

			let textDelete = document.createElement('p');
			textDelete.classList.add('deleteItem');
			textDelete.textContent = 'Supprimer';
			divDelete.appendChild(textDelete);

			totalQuantity();
			totalPrice();
		}
	}
};
displayCartItems();
