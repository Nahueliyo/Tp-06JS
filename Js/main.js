// variables y constantes
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let botonComprar = document.getElementById("boton-comprar");
let cartItemID = 1;

eventListeners();

// todos los event listeners

botonComprar.addEventListener("click", ()=>{
    Swal.fire({
        title: 'GRACIAS POR TU COMPRA',
        width: 600,
        padding: '3em',
        color: '#e99c2f',
        background:'url("https://c.tenor.com/398bVtl2W8EAAAAC/assassinscreed-dance.gif")',
       
      })
})

function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
    // cambiar la navbar cuando es clickeada
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    });

    // mostrar/esconder contenido del carro
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    // añadir a carro
    productList.addEventListener('click', purchaseProduct);

    // borrar del carro
    cartList.addEventListener('click', deleteProduct);
}

// actualizar carrito
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

//cargar contenido del JSON
function loadJSON(){
    fetch('Json/json.json')
    .then(response => response.json())
    .then(data =>{
        let html = '';
        data.forEach(product => {
            html += `
                <div class = "product-item">
                    <div class = "product-img">
                        <img src = "${product.imgSrc}" alt = "imagen producto">
                        <button type = "button" class = "add-to-cart-btn">
                            <i class = "fas fa-shopping-cart"></i>Add To Cart
                        </button>
                    </div>
                    <div class = "product-content">
                        <h3 class = "product-name">${product.name}</h3>
                        <span class = "product-category">${product.category}</span>
                        <p class = "product-price">$${product.price}</p>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    })
    // .catch(error => {
    //     alert(`error en el Server del usuario o local server`);
    // })
}


// Comprar producto
function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

//Obtener info del producto despues de clickear añadir al carro
function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

// añadir el producto seleccionado al carrito
function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-category">${product.category}</span>
            <span class = "cart-item-price">${product.price}</span>
        </div>
        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

// Guardar el producto en el storage local
function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

// Obtener la info de todos los productos si hay alguno en el storage local
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // Devuelve un array vacio si no hay info de producto
}

// Cargar productos al carro
function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; // si no hay ningun producto en el storage local
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else obtener el id del ultimo producto y sumarle 1
    }
    products.forEach(product => addToCartList(product));

    // calcular y actualizar info de la UI del carro
    updateCartInfo();
}

// calcular el precio total del carro y otra info
function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); // removiendo el signo $
        return acc += price;
    }, 0); // añadiendo todos los precios

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

// borrar productos del carro y del local storage
function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // esto solo remueve del DOM
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // esto solo remueve del DOM
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // actualizacion de la lista de productos despues de borrar
    updateCartInfo();
}