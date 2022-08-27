// récupére le panier du local storage traduit en objet JavaScript :
let cartArray = JSON.parse(localStorage.getItem('inCart'));

// variable globale sélecteur pour la fontion empty():
let section = document.getElementById('cart__items');

// Variables pour les fonctions de calcul totaux quantités et prix :
let totalPrice = 0;
let totalQuantity = 0;
let itemQty = 0;

// Enregistrement panier dans le local storage :
const saveCart = (cartArray) => {
	localStorage.setItem('inCart', JSON.stringify(cartArray));
};

// Si le panier est vide (suppression formulaire + message vers l'accueil) :
const emptyCart = () => {
	let title = document.createElement('h2');
	title.style.textAlign = 'center';
	title.style.fontSize = '2rem';
	title.textContent = ' 😕  Votre panier est vide...';
	section.appendChild(title);
	// Suppression du formumaire inutile :
	let orderForm = document.querySelector('.cart__order__form');
	orderForm.remove();
	let cartPriceTag = document.querySelector('.cart__price');
	cartPriceTag.remove();
	// boite de dialogue pour proposer de retourner à l'accueil :
	backToHomepage = confirm("Votre panier est vide. Retourner à l'accueil ?");
	if (backToHomepage) {
		location.href = 'index.html';
	}
};

// Fonctions de calcul des totaux quantités et prix :
const totalItemQuantity = () => {
	totalQuantity += Number(itemQty);
	document.getElementById('totalQuantity').textContent = totalQuantity;
};

const totalItemPrice = () => {
	totalPriceItemCart = itemQty * priceItemCart;
	totalPrice += totalPriceItemCart;
	document.getElementById('totalPrice').textContent = totalPrice;
};

const totalQuantityPrice = () => {
	totalItemQuantity();
	totalItemPrice();
};

/**
 * Fonction affichage des articles du panier :
 * Si le panier est vide, la fonction empty() est exécutée.
 * Sinon, fetch() pour récupérer toutes les données des produits
 * de l'API.Ceci car il n'y a que id, qty et color dans le local storage.
 * Puis : boucle 'for each' pour chaque item du tableau (cartArray),
 * récupére l' id, qty et color,
 * Crée et insère les éléments dans le DOM.
 * Appel des fonctions annexes.
 */
const displayCartItems = () => {
	if (cartArray == null) {
		emptyCart();
	} else {
		fetch('http://localhost:3000/api/products/')
			.then((res) => res.json())
			.then((itemsFromApi) => {
				cartArray.forEach((itemFromLs) => {
					// récupère les id, qty et color des prod ds le panier
					let itemId = itemFromLs.id;
					itemQty = itemFromLs.qty;
					let itemColor = itemFromLs.color;

					// retrouve les infos manquantes des articles du panier :
					const itemInCart = itemsFromApi.find((kanap) => kanap._id == itemId);

					// Variable du prix de l'article :
					priceItemCart = itemInCart.price;

					// création et insertion des éléments dans le DOM :
					let article = document.createElement('article');
					article.classList.add('cart__item');
					article.dataset.id = itemId;
					article.dataset.color = itemColor;
					section.appendChild(article);

					let divImg = document.createElement('div');
					divImg.classList.add('cart__item__img');
					article.appendChild(divImg);

					let img = document.createElement('img');
					img.src = itemInCart.imageUrl;
					img.alt = itemInCart.altTxt;
					divImg.appendChild(img);

					let divContent = document.createElement('div');
					divContent.classList.add('cart__item__content');
					article.appendChild(divContent);

					let divDescription = document.createElement('div');
					divDescription.classList.add('cart__item__content__description');
					divContent.appendChild(divDescription);

					let title = document.createElement('h2');
					title.textContent = itemInCart.name;
					divDescription.appendChild(title);

					let color = document.createElement('p');
					color.textContent = itemColor;
					divDescription.appendChild(color);

					let price = document.createElement('p');
					price.classList.add('price');
					let totalItemPrice = itemQty * itemInCart.price;
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

					let inputQty = document.createElement('input');
					inputQty.setAttribute('type', 'number');
					inputQty.classList.add('itemQuantity');
					inputQty.setAttribute('name', 'itemQuantity');
					inputQty.setAttribute('min', '1');
					inputQty.setAttribute('max', '100');
					inputQty.setAttribute('value', itemQty);
					divSettings.appendChild(inputQty);

					let divDelete = document.createElement('div');
					divDelete.classList.add('cart__item__content__settings__delete');
					divSettings.appendChild(divDelete);

					let textDelete = document.createElement('p');
					textDelete.classList.add('deleteItem');
					textDelete.textContent = 'Supprimer';
					divDelete.appendChild(textDelete);

					// appel fonction de calcul des totaux qtés et prix :
					totalQuantityPrice();
				});
				changeQuantity();
				deleteItemFromCart();
			})
			.catch((err) => console.log(err));
	}
};
displayCartItems();

// Fonction supprime des articles du panier :
const deleteItemFromCart = () => {
	let deleteItem = document.querySelectorAll('.deleteItem');

	deleteItem.forEach((deleteItem) => {
		deleteItem.addEventListener('click', () => {
			confirmDelete = confirm('Voulez-vous retirer cet article du panier ?');
			if (confirmDelete) {
				// closest() pointe le premier parent <article> du bouton supprimer, pour obtenir ensuite les dataset id et color à comparer :
				let articleTag = deleteItem.closest('article');

				// Filtre les articles du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
				cartArray = cartArray.filter(
					(kanap) =>
						kanap._id !== articleTag.dataset.id &&
						kanap.color !== articleTag.dataset.color
				);
				saveCart(cartArray);

				// Supprime l'élément <article> restant dans le DOM :
				if (articleTag.parentNode) {
					articleTag.parentNode.removeChild(articleTag);
				}

				// Si le panier est vide, fonction emptyCart() :
				if (cartArray == null || cartArray.length == 0) {
					emptyCart();
				} else {
					totalQuantityPrice();
					location.reload();
				}
			}
		});
	});
};

// Fonction modifie les quantités et prix :
const changeQuantity = () => {
	let inputButton = document.querySelectorAll('.itemQuantity');

	inputButton.forEach((item) => {
		item.addEventListener('change', () => {
			let newQuantity = Number(item.value); // item étant une string
			console.log(newQuantity);
			let articleTag = item.closest('article');

			let foundItem = cartArray.find(
				(kanap) =>
					kanap.id == articleTag.dataset.id &&
					kanap.color == articleTag.dataset.color
			);
			if (
				newQuantity > 0 &&
				newQuantity <= 100 &&
				Number.isInteger(newQuantity) // n'accepte que les nombres entiers
			) {
				foundItem.qty = newQuantity;
				saveCart(cartArray);
				totalQuantityPrice();
				location.reload();
			} else {
				alert('La quantité de cet article doit être comprise entre 1 et 100');
			}
		});
	});
};
