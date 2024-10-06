
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
    updateCart()
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
        updateCart();
    }
})

webCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('tacho')) {
        const product = e.target.parentElement.parentElement.parentElement;
        const imageId = product.querySelector('.product-card-img img').id;

        cart = cart.filter(
            product => product.imageId !== imageId
        );
        updateCart();
    };
});

const updateCartAsync = () => {
    return new Promise((resolve, reject) => {
        try {
            if (!webCart || !totalCart) {
                throw new Error('Required DOM elements not found');
            }

            webCart.innerHTML = '';
            let total = 0;

            if (!Array.isArray(cart)) {
                throw new Error('Cart is not an array');
            }

            cart.forEach(product => {
                if (!product || typeof product !== 'object') {
                    throw new Error('Invalid product in cart');
                }

                const containerProduct = document.createElement('div');
                if (!containerProduct) {
                    throw new Error('Failed to create container element');
                }
                containerProduct.classList.add('product-card');

                const safeProduct = {
                    imageId: product.imageId || '',
                    imageSrc: product.imageSrc || '',
                    imageAlt: product.imageAlt || '',
                    title: product.title || '',
                    description: product.description || '',
                    price: product.price || '',
                    quanty: product.quanty || 0
                };

                containerProduct.innerHTML = `
                    <div class="product-card-img">
                        <img id="${safeProduct.imageId}" src="${safeProduct.imageSrc}" alt="${safeProduct.imageAlt}">
                    </div>
                    <div class="product-card-text">
                        <div class="product-card-text-component_tittle">
                            <p>${safeProduct.title}</p>
                        </div>
                        <div class="product-card-text-component_description">
                            <p>${safeProduct.description}</p>
                        </div>
                        <div class="product-card-text-component_price">
                            <p class="product-card-price">${safeProduct.price}</p>
                        </div>
                    </div>
                    <div class="product-card-buttons">
                        <div class="#!">
                            <img class="tacho" src="assets/icons/delete_16.png" alt="img-list1">
                        </div>
                        <div class="cantidad" id="quantyBox">
                            <img src="assets/icons/minus-16.png" alt="icon-minus16" id="icon-minus" class="icon-minus">
                            <input class="cantidadcart" type="number" value="${safeProduct.quanty}">
                            <img src="assets/icons/plus-16.png" alt="icon-plus16" id="icon-plus" class="icon-plus">
                        </div>
                    </div>
                `;
                webCart.append(containerProduct);

                const price = parseFloat(safeProduct.price.replace(/[^\d.-]/g, ''));
                if (!isNaN(price) && !isNaN(safeProduct.quanty)) {
                    total += price * safeProduct.quanty;
                }
            });

            totalCart.innerHTML = `$${total.toFixed(3)}`;

            if (typeof saveLocalstorage === 'function') {
                saveLocalstorage();
            } else {
                console.warn('saveLocalstorage function not found');
            }

            resolve();
        } catch (error) {
            console.error('Error in updateCartAsync:', error);
            reject(error);
        }
    });
};


const updateCart = async () => {
    try {
        await updateCartAsync();
        console.log('Cart updated successfully');
    } catch (error) {
        console.error('Error updating cart:', error);
    }
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
        updateCart()
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
        updateCart()
    }
});

const saveLocalstorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart))
};

async function loadJson() {
    try {
        const productsList = await fetch('products.json');
        if (!productsList.ok) {
            throw new Error(`HTTP error! status: ${productsList.status}`);
        }
        const data = await productsList.json();

        if (!Array.isArray(data)) {
            throw new Error('Data is not an array');
        }

        data.forEach(({ id, url, alt, title, description, price } = {}) => {
            if (!id || !url || !alt || !title || !description || !price) {
                console.warn('Incomplete product data', { id, url, alt, title, description, price });
                return;
            }

            const containerProduct = document.createElement('div');
            containerProduct.classList.add('product-card');

            containerProduct.innerHTML = `
                <a href="#!">   
                    <div class="product-card-img">
                        <img id="${id}" src="${url}" alt="${alt}">
                    </div>                 
                    <div class="product-card-text">
                        <div class="product-card-text-component_tittle">
                            <p class="product-card-title">${title}</p>
                        </div>
                        <div class="product-card-text-component_description">
                            <p class="product-card-description">${description}</p>
                        </div>
                        <div class="product-card-text-component_price">
                            <p class="product-card-price">${price}</p>
                        </div>
                    </div>
                    <input class="product-card-button" type="button" value="Agregar al Carrito">
                </a>
            `;

            if (productCardList) {
                productCardList.append(containerProduct);
            } else {
                console.error('productCardList is not defined');
            }
        });
    } catch (error) {
        console.error('Error loading or processing data:', error.message);
        if (error instanceof TypeError) {
            console.log("Type Error");
        } else if (error instanceof SyntaxError) {
            console.log("Syntax Error");
        } else if (error instanceof ReferenceError) {
            console.log("Reference Error");
        }
    }
}
loadJson();

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