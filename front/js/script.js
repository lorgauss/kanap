// Récupération de tous les produits de l'api
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((products) => {
    productsDisplay(products);
  })
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur code api: " + err);
  });

// Affichage des produits sur la page
function productsDisplay(products) {

  let whereToDisplay = document.querySelector("#items");
  for (let item of products) 
  {
    whereToDisplay.innerHTML += 
    `<a href="./product.html?_id=${item._id}">
      <article>
        <img src="${item.imageUrl}" alt="${item.altTxt}">
        <h3 class="productName">${item.name}</h3>
        <p class="productDescription">${item.description}</p>
      </article>
    </a>`
    ;
  }
}
