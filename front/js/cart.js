//____________________________________________________________________________________________________________________________
//               [INSTRUCTIONS] AFFICHAGE DU PANIER
//____________________________________________________________________________________________________________________________

// Récupération des produits de l'api
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((productsCatalog) => {
    displayCart(productsCatalog);
})
.catch((err) => {
  document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
  console.log("erreur code api: " + err);
});
//____________________________________________________________________________________________________________________________
//               [INSTRUCTIONS] GESTION DU FORMULAIRE & ENVOIE DE LA COMMANDE
//____________________________________________________________________________________________________________________________

//Definition des Regex pour valider les inputs
let letterFormat = /^[/\p{Letter}]{1,31}$/gu;
let letterAndNumberFormat = /^[\w'.-\s,]{1,61}$/i;
let emailFormat= /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}$/i;

//Pointer vers les inputs du formulaire & ajout de class pour simplifer manipulation avec les Regex
var clientInfo = {};
localStorage.clientInfo = JSON.stringify(clientInfo);
  
var firstName = document.querySelector("#firstName");
firstName.classList.add("letterFormat");

var lastName = document.querySelector("#lastName");
lastName.classList.add("letterFormat");

var city = document.querySelector("#city");
city.classList.add("letterFormat");

var adress = document.querySelector("#address");
adress.classList.add("adressFormat");

var email = document.querySelector("#email");
email.classList.add("emailFormat");

//Eventlistener pour les input letterFormat
var zoneLetterFormat = document.querySelectorAll(".letterFormat");

zoneLetterFormat.forEach((zoneLetterFormat) =>
  zoneLetterFormat.addEventListener("input", (e) => {

    // valeur sera la valeur de l'input en dynamique
    value = e.target.value;

    // regexRespond sera la valeur de la réponse regex, 0 ou -1
    let regexRespond = value.search(letterFormat);

    if (regexRespond === 0) {
      clientInfo.firstName = firstName.value;
      clientInfo.lastName = lastName.value;
      clientInfo.city = city.value;
    }
    if (clientInfo.city !== "" && clientInfo.lastName !== "" && clientInfo.firstName !== "" && regexRespond === 0) {
      clientInfo.validLetterFormat = 3;
    } else {
      clientInfo.validLetterFormat = 0;
    }
    localStorage.clientInfo = JSON.stringify(clientInfo);
    inputFieldColor(regexRespond, value, zoneLetterFormat);
    isFormValid();
  })
);

fieldErrorMessage(letterFormat, "#firstNameErrorMsg", firstName);
fieldErrorMessage(letterFormat, "#lastNameErrorMsg", lastName);
fieldErrorMessage(letterFormat, "#cityErrorMsg", city);

//Eventlistener pour les input adressFormat
let zoneAdressFormat = document.querySelector(".adressFormat");
zoneAdressFormat.addEventListener("input", (e) => {
    
  value = e.target.value;
  let regexRespond = value.search(letterAndNumberFormat);

  if (regexRespond == 0) {
    clientInfo.address = adress.value;
  }
  if (clientInfo.address !== "" && regexRespond === 0) {
    clientInfo.validAdressFormat = 1;
  } else {
    clientInfo.validAdressFormat = 0;
  }
  localStorage.clientInfo = JSON.stringify(clientInfo);
  inputFieldColor(regexRespond, value, zoneAdressFormat);
  isFormValid();
});

fieldErrorMessage(letterAndNumberFormat, "#addressErrorMsg", adress);

//Eventlistener pour les input emailFormat
let zoneEmailFormat = document.querySelector(".emailFormat");
  zoneEmailFormat.addEventListener("input", (e) => {
    
    value = e.target.value;
    let regexRespond = value.search(emailFormat);

    if (regexRespond == 0) {
      clientInfo.email = email.value;
    }
    if (clientInfo.address !== "" && regexRespond === 0) {
      clientInfo.validEmailFormat = 1;
    } else {
      clientInfo.validEmailFormat = 0;
    }

    localStorage.clientInfo = JSON.stringify(clientInfo);
    inputFieldColor(regexRespond, value, zoneEmailFormat);
    isFormValid();
  });

fieldErrorMessage(emailFormat, "#emailErrorMsg", email);

let order = document.querySelector("#order");

// Envoi de la commande
order.addEventListener("click", (e) => {

  if(document.querySelector("#firstNameErrorMsg").textContent===""){
    document.querySelector("#firstNameErrorMsg").textContent = "Champ Obligatoire";
    document.querySelector("#firstNameErrorMsg").style.color = "white";
  }
  if(document.querySelector("#lastNameErrorMsg").textContent===""){
    document.querySelector("#lastNameErrorMsg").textContent = "Champ Obligatoire";
    document.querySelector("#lastNameErrorMsg").style.color = "white";
  }
  if(document.querySelector("#addressErrorMsg").textContent===""){
    document.querySelector("#addressErrorMsg").textContent = "Champ Obligatoire";
    document.querySelector("#addressErrorMsg").style.color = "white";
  }
  if(document.querySelector("#cityErrorMsg").textContent===""){
    document.querySelector("#cityErrorMsg").textContent = "Champ Obligatoire";
    document.querySelector("#cityErrorMsg").style.color = "white";
  }
  if(document.querySelector("#emailErrorMsg").textContent===""){
    document.querySelector("#emailErrorMsg").textContent = "Champ Obligatoire";
    document.querySelector("#emailErrorMsg").style.color = "white";
  }

  e.preventDefault();
  isFormValid();
  sendPacket();
});

let articlesId = [];

let clientInfoTemp;
let orderRecap;

//____________________________________________________________________________________________________________________________
//                  [FUNCTIONS] AFFICHAGE DU PANIER
//____________________________________________________________________________________________________________________________

// Fonction mère d'affichage du panier
function displayCart(index) {
  let cart = JSON.parse(localStorage.getItem("cartSaved"));
  if (cart && cart.length != 0) {
    for (let item of cart) {
      for (let g = 0, h = index.length; g < h; g++) {
        if (item._id === index[g]._id) {
          item.name = index[g].name;
          item.prix = index[g].price;
          item.image = index[g].imageUrl;
          item.description = index[g].description;
          item.alt = index[g].altTxt;
        }
      }   
    }
    displayItem(cart);
  } else {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Pas d'article dans le panier";
  }
  quantity();
  deleteItem();
}

//Fonction d'affichage d'un item du panier
function displayItem(cart) {
  let zonePanier = document.querySelector("#cart__items");
  zonePanier.innerHTML += cart.map((item) => 
    `<article class="cart__item" data-id="${item._id}" data-couleur="${item.couleur}" data-qt="${item.qt}" data-prix="${item.prix}"> 
      <div class="cart__item__img">
        <img src="${item.image}" alt="${item.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${item.name}</h2>
          <span>couleur : ${item.couleur}</span>
          <p data-prix="${item.prix}">${item.prix} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.qt}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${item._id}" data-couleur="${item.couleur}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
  ).join(""); 
  sum();
}

//Fonction de recherche dichotomique de l'indice de l'article dont l'id et la couleur conviennent
function dichoSearch (cart, search){
  let start = 0;
  let mid;
  let end = cart.length;
  let found = false;
  while(!found && start<=end){
    mid = Math.trunc((start+end)/2)
    if(cart[mid]._id===search.id && cart[mid].couleur===search.couleur){
      found = true;
    }else{
      if(cart[mid]._id!==search.id){
        if(search.id > cart[mid]._id){
          start = mid+1;
        }else{
          end = mid-1;
        }
      }else{
        if(search.couleur > cart[mid].couleur){
          start = mid+1;
        }else{
          end = mid-1;
        }
        
      }
    }
  }
  return (mid); 
}

//Fonction quantity pour modifier dynamiquement les quantités des items du panier
function quantity() {
  
  const cartItem = document.querySelectorAll(".cart__item");
  cartItem.forEach((cartItem) => {
    cartItem.addEventListener("change", (eq) => {
      let cart = JSON.parse(localStorage.getItem("cartSaved"));
      
      let index = dichoSearch(cart, cartItem.dataset);

      if (cart[index]._id === cartItem.dataset.id && cartItem.dataset.couleur === cart[index].couleur) {
        if(eq.target.value<1){
          cart[index].qt = "1";
          cartItem.dataset.qt = "1";
          eq.target.value = "1";
        }else{
          if(eq.target.value>100){
            cart[index].qt = "100";
            cartItem.dataset.qt = "100";
            eq.target.value = "100";
          }else{
            cart[index].qt = JSON.stringify(eq.target.value*1);
            cartItem.dataset.qt = JSON.stringify(eq.target.value*1);
            eq.target.value = JSON.stringify(eq.target.value*1);
          }
        }
        localStorage.cartSaved = JSON.stringify(cart);
        sum();
      }
    });
  });
}
  
//Fonction supression avec une actualisation de la page pour raffraichir l'affichage
function deleteItem() {
    
  const deleteButtons = document.querySelectorAll(".cart__item .deleteItem");    
  deleteButtons.forEach((deleteButton) => {

    deleteButton.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cartSaved"));

      let indexFound = dichoSearch(cart, deleteButton.dataset);

      let updatedCart = JSON.parse(localStorage.getItem("cartSaved"));
      updatedCart.splice(indexFound, 1);
      localStorage.cartSaved = JSON.stringify(updatedCart);

      return location.reload();
    });    
  });
}

// fonction Somme du nombre d'articles et prix total
function sum() {
  let sumQt = 0;
  let sumPrice = 0;
  let articles = document.querySelectorAll(".cart__item");
  articles.forEach((artcile) => {
    sumQt += JSON.parse(artcile.dataset.qt);
    sumPrice += artcile.dataset.qt * artcile.dataset.prix;
  });
  document.getElementById("totalQuantity").textContent = sumQt;
  document.getElementById("totalPrice").textContent = sumPrice;
}


//____________________________________________________________________________________________________________________________
//                  [FUNCTIONS] GESTION DU FORMULAIRE & ENVOIE DE LA COMMANDE
//____________________________________________________________________________________________________________________________

function inputFieldColor(regex, inputValue, field) {
  if (inputValue === "" && regex != 0) {
    field.style.backgroundColor = "white";
    field.style.color = "black";
    // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
  } else if (inputValue !== "" && regex != 0) {
    field.style.backgroundColor = "rgb(220, 50, 50)";
    field.style.color = "white";
    // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
  } else {
    field.style.backgroundColor = "rgb(0, 138, 0)";
    field.style.color = "white";
  }
}
//--------------------------------------------------------------
// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
//--------------------------------------------------------------
function fieldErrorMessage(regex, pointage, zoneEcoute) {
  zoneEcoute.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;
    index = valeur.search(regex);

    // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
    if (valeur === "" && index != 0) {
      document.querySelector(pointage).textContent = "Champ Obligatoire";
      document.querySelector(pointage).style.color = "white";
      // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
    } else if (valeur !== "" && index != 0) {
      document.querySelector(pointage).innerHTML = "Format non valide";
      document.querySelector(pointage).style.color = "white";
      // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
    } else {
      document.querySelector(pointage).innerHTML = "";
      document.querySelector(pointage).style.color = "white";
    }
  });
}

//--------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//--------------------------------------------------------------

// la fonction sert à valider le clic de commande de manière interactive
function isFormValid() {
  let clientInfo = JSON.parse(localStorage.getItem("clientInfo"));
  let somme = clientInfo.validLetterFormat + clientInfo.validAdressFormat + clientInfo.validEmailFormat;
  if (somme === 5) {
    order.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    order.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}

//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------

function idTable() {
  let cart = JSON.parse(localStorage.getItem("cartSaved"));
  // récupération des id produit dans articlesId
  if (cart && cart.length > 0) {
    for (let item of cart) {
      articlesId.push(item._id);
    }
  } else {
    document.querySelector("#order").setAttribute("value", "Panier vide!");
  }
}

//----------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//----------------------------------------------------------------

function packet() {
  clientInfoTemp = JSON.parse(localStorage.getItem("clientInfo"));
  // définition de l'objet commande
  orderRecap = {
    contact: {
      firstName: clientInfoTemp.firstName,
      lastName: clientInfoTemp.lastName,
      address: clientInfoTemp.address,
      city: clientInfoTemp.city,
      email: clientInfoTemp.email,
    },
    products: articlesId,
  };
}

//----------------------------------------------------------------
// fonction sur la validation de l'envoi
//----------------------------------------------------------------
function sendPacket() {
  idTable();
  packet();
  
  let sum = clientInfo.validLetterFormat + clientInfo.validAdressFormat + clientInfo.validEmailFormat;
  // si le articlesId contient des articles et que le clic est autorisé
  if (articlesId.length != 0 && sum === 5) {
    // envoi à la ressource api
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRecap),
    })
      .then((res) => res.json())
      .then((data) => {
        // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}