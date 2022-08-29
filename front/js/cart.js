// récupére le panier du local storage traduit en objet JavaScript :
let cartArray = JSON.parse(localStorage.getItem('inCart'));

// variable globale sélecteur pour la fontion emptyCart():
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
 * Si le panier est vide, la fonction emptyCart() est exécutée.
 * Sinon, fetch() pour récupérer toutes les données des produits
 * de l'API. Car il n'y a que : id, qty et color dans le local storage.
 * Puis, boucle 'for each' : pour chaque article du panier (cartArray),
 * récupére l' id, qty et color.
 * Récupère les infos manquantes des articles du panier en les matchant avec
 * ceux de l'API grâce à leur id.
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

					// Variable du prix de l'article  :
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

				// Si le panier devient vide, éxécute emptyCart() :
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

/**
 * Fonction modifie les quantités et prix :
 * Sélectionne tous les boutons input pour les écouter au changement.
 * Boucle forEach : pour chaque changement sur un des articles de même id ET
 * même couleur, remplace l'ancienne valeur par la nouvelle.
 * Si la nouvelle valeur de quantité est comprise entre 1 et 100, enregistre
 * dans le panier du local storage et calcule les nouveaux totaux (+
 * rechargement de la page pour affichage).
 * Sinon, affiche un message d'erreur de quantité.
 */
const changeQuantity = () => {
	let inputButton = document.querySelectorAll('.itemQuantity');

	inputButton.forEach((newInput) => {
		newInput.addEventListener('change', () => {
			let newQuantity = Number(newInput.value); // newInput étant une string, on le change en nombre.
			let articleTag = newInput.closest('article');

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

// Sélection de la balise "form" pour pour attraper les input par leur attribut "name" :
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
const nameRegEx = new RegExp("^[a-zA-Z-' ]+$");
const addressRegEx = new RegExp(
	"^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
const emailRegEx = new RegExp(
	'^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+.)+[a-z]{2,5}$'
);

// Validation des saisies dans les champs du formulaire :
firstName.addEventListener('change', () => {
	if (nameRegEx.test(firstName.value)) {
		firstNameErrorMsg.textContent = '';
	} else {
		firstNameErrorMsg.textContent = "La saisie du prénom n'est pas valide";
	}
});

lastName.addEventListener('change', () => {
	if (nameRegEx.test(lastName.value)) {
		lastNameErrorMsg.textContent = '';
	} else {
		lastNameErrorMsg.textContent = "La saisie du nom n'est pas valide";
	}
});

address.addEventListener('change', () => {
	if (addressRegEx.test(address.value)) {
		addressErrorMsg.textContent = '';
	} else {
		addressErrorMsg.textContent = "La saisie de l'adresse n'est pas valide";
	}
});

city.addEventListener('change', () => {
	if (nameRegEx.test(city.value)) {
		cityErrorMsg.textContent = '';
	} else {
		cityErrorMsg.textContent = "La saisie de la ville n'est pas valide";
	}
});

email.addEventListener('change', () => {
	if (emailRegEx.test(email.value)) {
		emailErrorMsg.textContent = '';
	} else {
		emailErrorMsg.textContent =
			"La saisie de l'adresse e-mail n'est pas valide";
	}
});

//---- FONCTIONS BOUTON "COMMANDER" ----
const orderButton = document.getElementById('order');

// Vérification et validation du formulaire et envoi de la commande :
const isFormValid = () => {
	orderButton.addEventListener('click', (e) => {
		e.preventDefault(); // empêche d'envoyer les données avant la vérification de données valides.

		// Vérification de la validité du formulaire avant envoi :
		if (
			nameRegEx.test(firstName.value) &&
			nameRegEx.test(lastName.value) &&
			addressRegEx.test(address.value) &&
			nameRegEx.test(city.value) &&
			emailRegEx.test(email.value)
		) {
			sendOrderToServer();
		} else {
			alert('Un ou plusieurs champs du formulaire ne sont pas valides');
		}
	});
};
isFormValid();

// Création d'un tableau contenant les id des articles pour envoi serveur :
const arrayItemId = cartArray.map((item) => {
	return item.id;
});

const sendOrderToServer = () => {
	// crée l'objet attendu par l'API (infos "contact" + "products"):
	let order = {
		contact: {
			firstName: firstName.value,
			lastName: lastName.value,
			address: address.value,
			city: city.value,
			email: email.value,
		},
		products: arrayItemId,
	};

	/**
	 * Envoi de la commande qu format JSON à l'API.
	 * L'API retourne un numérode commande que 'on récupère sous forme de
	 * variable.
	 * Insère cette variable par interpolation dans l'URL de redirection vers
	 * la page confirmation.
	 * Si erreur de l'API, affiche un message.
	 */
	fetch('http://localhost:3000/api/products/order', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(order),
	})
		.then((res) => res.json())
		.then((data) => {
			const orderIdNbr = data.orderId;
			window.location = `confirmation.html?orderId=${orderIdNbr}`;
		})
		.catch((error) => {
			alert("Veuillez nous excuser, la requête au serveur n'a pu aboutir");
		});
};
