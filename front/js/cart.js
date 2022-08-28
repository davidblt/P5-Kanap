// récupére le panier du local storage traduit en objet JavaScript :
let cartArray = JSON.parse(localStorage.getItem('inCart'));

// variable globale sélecteur pour la fontion empty():
let displayContainerTag = document.getElementById('cart__items');

// Variables pour les fonctions de calcul totaux quantités et prix :
let totalPrice = 0;
let totalQuantity = 0;
let itemLsQty = 0;

// Enregistrement panier dans le local storage :
const saveCart = (cartArray) => {
	localStorage.setItem('inCart', JSON.stringify(cartArray));
};

// Si le panier est vide (suppression formulaire + message vers l'accueil) :
const emptyCart = () => {
	let titleTag = document.createElement('h2');
	titleTag.style.textAlign = 'center';
	titleTag.style.fontSize = '2rem';
	titleTag.textContent = ' 😕  Votre panier est vide...';
	displayContainerTag.appendChild(titleTag);
	// Suppression du formumaire inutile :
	let orderFormTag = document.querySelector('.cart__order__form');
	orderFormTag.remove();
	let cartPriceTag = document.querySelector('.cart__price');
	cartPriceTag.remove();
	// boite de dialogue pour proposer de retourner à l'accueil :
	backToHomepageMsg = confirm("Votre panier est vide. Retourner à l'accueil ?");
	if (backToHomepageMsg) {
		location.href = 'index.html';
	}
};

// Fonctions de calcul des totaux quantités et prix :
const calcTotalQuantity = () => {
	totalQuantity += Number(itemLsQty);
	document.getElementById('totalQuantity').textContent = totalQuantity;
};

const calcTotalPrice = () => {
	totalPriceItemCart = itemLsQty * priceItemCart;
	totalPrice += totalPriceItemCart;
	document.getElementById('totalPrice').textContent = totalPrice;
};

const calcTotalQuantityPrice = () => {
	calcTotalQuantity();
	calcTotalPrice();
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
				cartArray.forEach((itemFromLocalStorage) => {
					// récupère les id, qty et color des prod ds le panier
					let itemLsId = itemFromLocalStorage.id;
					itemLsQty = itemFromLocalStorage.qty;
					let itemLsColor = itemFromLocalStorage.color;

					// retrouve les infos manquantes des articles du panier :
					const itemInCart = itemsFromApi.find(
						(kanap) => kanap._id == itemLsId
					);

					// Variable du prix de l'article :
					priceItemCart = itemInCart.price;

					// création et insertion des éléments dans le DOM :
					let articleTag = document.createElement('article');
					articleTag.classList.add('cart__item');
					articleTag.dataset.id = itemLsId;
					articleTag.dataset.color = itemLsColor;
					displayContainerTag.appendChild(articleTag);

					let divImgTag = document.createElement('div');
					divImgTag.classList.add('cart__item__img');
					articleTag.appendChild(divImgTag);

					let imgTag = document.createElement('img');
					imgTag.src = itemInCart.imageUrl;
					imgTag.alt = itemInCart.altTxt;
					divImgTag.appendChild(imgTag);

					let divContentTag = document.createElement('div');
					divContentTag.classList.add('cart__item__content');
					articleTag.appendChild(divContentTag);

					let divDescriptionTag = document.createElement('div');
					divDescriptionTag.classList.add('cart__item__content__description');
					divContentTag.appendChild(divDescriptionTag);

					let titleTag = document.createElement('h2');
					titleTag.textContent = itemInCart.name;
					divDescriptionTag.appendChild(titleTag);

					let paraColorTag = document.createElement('p');
					paraColorTag.textContent = itemLsColor;
					divDescriptionTag.appendChild(paraColorTag);

					let paraPriceTag = document.createElement('p');
					paraPriceTag.classList.add('price');
					let totalItemPrice = itemLsQty * itemInCart.price;
					paraPriceTag.textContent = totalItemPrice + ' €';
					divDescriptionTag.appendChild(paraPriceTag);

					let divSettingsTag = document.createElement('div');
					divSettingsTag.classList.add('cart__item__content__settings');
					articleTag.appendChild(divSettingsTag);

					let divQuantityTag = document.createElement('div');
					divQuantityTag.classList.add(
						'cart__item__content__settings__quantity'
					);
					divSettingsTag.appendChild(divQuantityTag);

					let quantity = document.createElement('p');
					quantity.textContent = 'Qté : ';
					divQuantityTag.appendChild(quantity);

					let inputQtyTag = document.createElement('input');
					inputQtyTag.setAttribute('type', 'number');
					inputQtyTag.classList.add('itemQuantity');
					inputQtyTag.setAttribute('name', 'itemQuantity');
					inputQtyTag.setAttribute('min', '1');
					inputQtyTag.setAttribute('max', '100');
					inputQtyTag.setAttribute('value', itemLsQty);
					divSettingsTag.appendChild(inputQtyTag);

					let divDeleteTag = document.createElement('div');
					divDeleteTag.classList.add('cart__item__content__settings__delete');
					divSettingsTag.appendChild(divDeleteTag);

					let paraDeleteTag = document.createElement('p');
					paraDeleteTag.classList.add('deleteItem');
					paraDeleteTag.textContent = 'Supprimer';
					divDeleteTag.appendChild(paraDeleteTag);

					// appel fonction de calcul des totaux qtés et prix :
					calcTotalQuantityPrice();
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
	let deleteItemButton = document.querySelectorAll('.deleteItem');

	deleteItemButton.forEach((button) => {
		button.addEventListener('click', () => {
			confirmDeleteMsg = confirm('Voulez-vous retirer cet article du panier ?');
			if (confirmDeleteMsg) {
				// closest() pointe le premier parent <article> du bouton supprimer, pour obtenir ensuite les dataset id et color à comparer :
				let buttonParentTag = button.closest('article');

				// Filtre les articles du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
				cartArray = cartArray.filter(
					(kanap) =>
						kanap._id !== buttonParentTag.dataset.id &&
						kanap.color !== buttonParentTag.dataset.color
				);
				saveCart(cartArray);

				// Supprime l'élément <article> restant dans le DOM :
				if (buttonParentTag.parentNode) {
					buttonParentTag.parentNode.removeChild(buttonParentTag);
				}

				// Si le panier est vide, fonction emptyCart() :
				if (cartArray == null || cartArray.length == 0) {
					emptyCart();
				} else {
					calcTotalQuantityPrice();
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
				calcTotalQuantityPrice();
				location.reload();
			} else {
				alert('La quantité de cet article doit être comprise entre 1 et 100');
			}
		});
	});
};

// ------- EXPRESSIONS REGULIERES DU FORMULAIRE -------

// Sélection de la balise "form" pour pour attraper les input par leur "name"
const form = document.querySelector('.cart__order__form');
const firstName = form.firstName;
const lastName = form.lastName;
const address = form.address;
const city = form.city;
const email = form.email;

const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
const addressErrorMsg = document.getElementById('addressErrorMsg');
const cityErrorMsg = document.getElementById('cityErrorMsg');
const emailErrorMsg = document.getElementById('emailErrorMsg');

// Variables contenant les Expressions Régulières :
const nameRegExp = new RegExp(
	"^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
const addressRegExp = new RegExp(
	"^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
const emailRegExp = new RegExp(
	'^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+.)+[a-z]{2,5}$'
);

// Validation des saisies dans les champs du formulaire :
firstName.addEventListener('change', () => {
	if (nameRegExp.test(firstName.value)) {
		firstNameErrorMsg.textContent = '';
	} else {
		firstNameErrorMsg.textContent = "La saisie du prénom n'est pas valide";
	}
});

lastName.addEventListener('change', () => {
	if (nameRegExp.test(lastName.value)) {
		lastNameErrorMsg.textContent = 'Saisie ok';
	} else {
		lastNameErrorMsg.textContent = "La saisie du prénom n'est pas valide";
	}
});

address.addEventListener('change', () => {
	if (addressRegExp.test(address.value)) {
		addressErrorMsg.textContent = '';
	} else {
		addressErrorMsg.textContent = "La saisie du prénom n'est pas valide";
	}
});

city.addEventListener('change', () => {
	if (nameRegExp.test(city.value)) {
		cityErrorMsg.textContent = '';
	} else {
		cityErrorMsg.textContent = "La saisie de la ville n'est pas valide";
	}
});

email.addEventListener('change', () => {
	if (emailRegExp.test(email.value)) {
		emailErrorMsg.textContent = '';
		console.log(email.value);
	} else {
		emailErrorMsg.textContent =
			"La saisie de l'adresse e-mail n'est pas valide";
	}
});
