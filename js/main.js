
const indexgalleryContainers = document.querySelectorAll('.index-carousel');

const nxtBtn = document.querySelectorAll('.nxt-btn');
const preBtn = document.querySelectorAll('.pre-btn');

indexgalleryContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;
    let containerFinalWidth = containerWidth / 2;

    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerFinalWidth;
    })

    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerFinalWidth;
    })

    indexgalleryContainers[i].addEventListener('wheel', (e) => {
        e.preventDefault();
        e.deltaY > 0 ? item.scrollLeft += containerFinalWidth : item.scrollLeft -= containerFinalWidth;
    })
});

function showCart() {
    cart = JSON.parse(localStorage.getItem('cart'))
    document.getElementById('cartContainer').style.display = 'block';
    showInHTML()
}

function hideCart() {
    document.getElementById('cartContainer').style.display = 'none';
}

const webCart = document.getElementById('webCart');
const productCard = document.getElementById('productCard');
const productCardList = document.getElementById('indexCarousel');
let cart = [];

let totalCart = document.getElementById('totalCart');

productCardList.addEventListener('click', (e) => {
    if (e.target.classList.contains('product-card-button')) {

        const product = e.target.parentElement;

        const productInfo = {
            imageId: product.querySelector('.product-card-img img').id,
            imageSrc: product.querySelector('.product-card-img img').src,
            imageAlt: product.querySelector('.product-card-img img').alt,
            title: product.querySelector('.product-card-title').textContent,
            description: product.querySelector('.product-card-text-component_description').textContent,
            price: product.querySelector('.product-card-price').textContent,
            quanty: 1
        }

        const ifExistProduct = cart.some(product => product.imageId === productInfo.imageId)

        if (ifExistProduct) {
            const products = cart.map(product => {
                return product.imageId === productInfo.imageId ? product.quanty++ && product : product;
            })

            cart = [...products];
        }

        else {
            cart = [...cart, productInfo]
        }
        showInHTML();
    }
})

webCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('tacho')) {
        const product = e.target.parentElement.parentElement.parentElement;
        const imageId = product.querySelector('.product-card-img img').id;

        cart = cart.filter(
            product => product.imageId !== imageId
        );
        showInHTML();
    };
});

const showInHTML = () => {
    webCart.innerHTML = [];
    let total = 0;

    cart.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('product-card');

        containerProduct.innerHTML = `
        <div class="product-card-img">
                        <img id=${product.imageId} src=${product.imageSrc} alt=${product.imageAlt}>
                    </div>
                    <div class="product-card-text">
                        <div class="product-card-text-component_tittle">
                            <p>${product.title}</p>
                        </div>
                        <div class="product-card-text-component_description">
                            <p>${product.description}</p>
                        </div>
                        <div class="product-card-text-component_price">
                            <p class="product-card-price">${product.price}</p>
                        </div>
                    </div>
                    <div class="product-card-buttons">
                        <div class="#!">
                            <img class="tacho" src="assets/icons/delete_16.png" alt="img-list1">
                        </div>
                        <div class="cantidad" id="quantyBox">
                        <img src="assets/icons/minus-16.png" alt="icon-minus16" id="icon-minus" class="icon-minus">
                            <input class="cantidadcart" type="number" value="${product.quanty}">
                        <img src="assets/icons/plus-16.png" alt="icon-plus16" id="icon-plus" class="icon-plus">
                        </div>
                    </div>
        `
        webCart.append(containerProduct);
        total = total + parseFloat(product.quanty * product.price.slice(1));
    });
    totalCart.innerHTML = `$${total.toFixed(3)}`;
    saveLocalstorage()
};

webCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-plus')) {

        const product = e.target.parentElement.parentElement.parentElement;

        const productInfo = {
            imageId: product.querySelector('.product-card-img img').id,
            quanty: product.querySelector('.cantidadcart').value,
        }

        const ifRepeatProduct = cart.some(product => product.imageId === productInfo.imageId)

        if (ifRepeatProduct) {
            const products = cart.map(product => {

                if (product.imageId === productInfo.imageId) {
                    product.quanty++
                    return product
                }
                else {
                    return product;
                }
            })
            cart = [...products];
        }
        else {
            cart = [...cart, productInfo]
        }
        showInHTML()
    }
});

webCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-minus')) {

        const product = e.target.parentElement.parentElement.parentElement;

        const productInfo = {
            imageId: product.querySelector('.product-card-img img').id,
            quanty: product.querySelector('.cantidadcart').value,
        }

        const ifRepeatProduct = cart.some(product => product.imageId === productInfo.imageId)

        if (ifRepeatProduct) {
            const products = cart.map(product => {
                if (product.imageId === productInfo.imageId) {
                    if (product.quanty === 1) {
                        return product;
                    }
                    else {
                        product.quanty--;
                        return product;
                    }
                }
                else {
                    return product;
                }
            })
            cart = [...products];
        }
        else {
            cart = [...cart, productInfo]
        }
        showInHTML()
    }
});

const saveLocalstorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart))
};

async function loadJson() {
    try {
        productsList = await fetch('products.json')
        data = await productsList.json()

        data.forEach(function (product) {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('product-card');

            containerProduct.innerHTML = `
                <a href="#!">   
                    <div class="product-card-img">
                        <img id="${product.id}" src=${product.url} alt="${product.alt}">
                    </div>                 
                    <div class="product-card-text">
                        <div class="product-card-text-component_tittle">
                            <p class="product-card-title">${product.title}</p>
                        </div>
                        <div class="product-card-text-component_description">
                            <p class="product-card-description">${product.description}</p>
                        </div>
                        <div class="product-card-text-component_price">
                            <p class="product-card-price">${product.price}</p>
                        </div>
                    </div>
                    <input class="product-card-button" type="button" value="Agregar al Carrito">
                </a>
                `
            productCardList.append(containerProduct);
        })
    } catch (error) {
        if (error instanceof TypeError) {
            console.log("Type Error")
        }
        if (error instanceof SyntaxError) {
            console.log("Syntax Error")
        }
        if (error instanceof ReferenceError) {
            console.log("Reference Error")
        }
    }
}
loadJson()

btnEndBuy = document.getElementById('endBuyButton')
btnEndBuy.addEventListener('click', () => {
    cart.length > 0 ?
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Te enviaremos tus productos cuando esten listos!",
            showConfirmButton: false,
            timer: 2700
        }) :
        Swal.fire("No tienes productos en tu carrito!");
})