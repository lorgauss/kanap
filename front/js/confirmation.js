(function Commande() {
    
    //Récupération de l'orderId localisé dans l'url
    let orderId = new URLSearchParams(document.location.search).get("commande");
    
    //Affichage
    document.querySelector("#orderId").innerHTML = `<br>${orderId}`;
    
    //Nettoyage des données stockées et réinisialisation du orderId
    sessionStorage.clear();
    localStorage.clear();
    orderId = undefined;
})();