// Recuperation _id produit des produits de l'api
const params = new URLSearchParams(document.location.search);
const id = params.get("_id");
let requestedProduct = {};
requestedProduct._id = id;

let cartInit = [];
let cartMemory = [];

let colorChoice = document.querySelector("#colors");

let qtfield = document.querySelector('input[id="quantity"]');
let productQt;

let choixProduit = document.querySelector("#addToCart");

  fetch("http://localhost:3000/api/products/"+id)
    .then((res) => res.json())
    .then((product) => {
      productDisplay(product);
    })
    .catch((err) => {
      console.log("erreur code de l'api: "+err);
  });

// Gestion de l'affichage du bouton "ajouté au panier" est recuperation des changement dans les inputs de couleur et quantité
colorChoice.addEventListener("input", (ec) => {
  let color;
  color = ec.target.value;
  requestedProduct.couleur = color;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
});

qtfield.addEventListener("input", (eq) => {
  productQt = eq.target.value;
  requestedProduct.qt =JSON.stringify(productQt*1);
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
});

// Verification validité des entrées
choixProduit.addEventListener("click", () => {
  if (!(requestedProduct.couleur === "" || requestedProduct.couleur === undefined)){
      if(!(requestedProduct.qt < 1 || requestedProduct.qt > 100 || requestedProduct.qt === undefined)){
        cart();
        document.querySelector("#addToCart").style.color = "rgb(0, 175, 0)";
        document.querySelector("#addToCart").textContent = "Produit ajouté au panier";
      }else{
        alert("Quantité incorrecte, veillez à avoir une quantité comprise entre 1 et 100");
      }
  }else{
    alert("Couleur incorrecte, veillez à choisir une couleur");
  }  
});

//__________________________________________________________________________________________________________________________________
//                                                FONCTIONS
//__________________________________________________________________________________________________________________________________

//Fonction d'affichage
function productDisplay(product) {
  document.querySelector("article div.item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  document.querySelector("#title").textContent = `${product.name}`;
  document.querySelector("#price").textContent = `${product.price}`;
  document.querySelector("#description").textContent = `${product.description}`;
  for (let color of product.colors) {
    document.querySelector("#colors").innerHTML += `<option value="${color}">${color}</option>`;
  }
}

// Fonction mère du panier
function cart() {
  cartMemory = JSON.parse(localStorage.getItem("cartSaved"));
  if (cartMemory === null) {
    return initialisationCart();
  }
  return updateCart();
}

// Fonction d'initialisation du panier
function initialisationCart() {
  cartInit.push(requestedProduct);
  return (localStorage.cartSaved = JSON.stringify(cartInit));
}

// Fonction d'actualisation du panier
function updateCart(){
  for (let cartItem of cartMemory) {
    if (cartItem._id === id && cartItem.couleur === requestedProduct.couleur) {
      return updateQuantity(cartItem);
    }
  }
  return addProductToCart();
}

// Fonction d'actualisation de la quantité d'un produit déjà dans le panier
function updateQuantity(cartItem){
  cartItem.qt = JSON.stringify(parseInt(cartItem.qt) + parseInt(productQt));
  if(cartItem.qt>100){
    cartItem.qt = "100";
  }
  return (localStorage.cartSaved = JSON.stringify(cartMemory));
}

// fonction d'ajout d'un nouveau produit avec tris du tableau resultant
function addProductToCart() {
cartMemory.push(requestedProduct);
cartMemory.sort(function compare(a, b) {
  if (a._id < b._id) return -1;
  if (a._id > b._id) return 1;
  if (a._id = b._id){
    if (a.couleur < b.couleur) return -1;
    if (a.couleur > b.couleur) return 1;
  }
  return 0;
});
return (localStorage.cartSaved = JSON.stringify(cartMemory));
}