const shippingRate = 15.0;
const taxRate = 0.18;
const dampingRate = 0.7;
const productPanel = document.querySelector('#product-panel');


let products = [];


const getDataFromDatabase = () => {
  products = JSON.parse(localStorage.getItem('products')) || [];
};


document.querySelector('form').addEventListener('submit', () => {
  const newProductName = document.querySelector('#add-name').value;
  const newProductPrice = document.querySelector('#add-price').value;
  const newProductQuantity = document.querySelector('#add-quantity').value;
  const newProductUrl = document.querySelector('#add-image').value;
  
  const newProduct = {
    id: Math.ceil(Math.random() * 1000),
    name: newProductName,
    price: Number(newProductPrice),
    amount: Number(newProductQuantity),
    img: newProductUrl,
  };
  
  products.push(newProduct);
 
  localStorage.setItem('products', JSON.stringify(products));
  document.querySelector('form').reset();
  
  renderSingleProduct(newProduct);
 
  calculateCardTotal();
});


function renderAllProducts() {
  
  productPanel.innerHTML = '';

  
  if (!products.length) return;


  products.forEach((product) => {
    renderSingleProduct(product);
  });
}


function renderSingleProduct(product) {
 
  const { id, name, img, amount, price } = product;
 
  const card = document.createElement('div');
  card.classList.add('card', 'shadow-lg', 'mb-3');
  card.dataset.id = id;
  card.innerHTML = `
            <div class="row g-0">
              <div class="col-md-5">
                <img
                  src=${img}
                  class="w-100 h-100 rounded-start"
               />
              </div>
              <div class="col-md-7">
                <div class="card-body">
                  <h5 class="card-title">${name}</h5>
                  <div class="product-price">
                    <p class="text-warning h2">$
                      <span class="damping-price">${(
                        price * dampingRate
                      ).toFixed(2)}</span>
                      <span class="h5 text-dark text-decoration-line-through">${price.toFixed(
                        2
                      )}</span>
                    </p>
                  </div>
                  <div
                    class="border border-1 border-dark shadow-lg d-flex justify-content-center p-2"
                  >
                    <div class="quantity-controller">
                      <button class="btn btn-secondary btn-sm decrease">
                        <i class="fas fa-minus decrease"></i>
                      </button>
                      <p class="d-inline mx-4" id="product-quantity">${amount}</p>
                      <button class="btn btn-secondary btn-sm increase">
                        <i class="fas fa-plus increase"></i>
                      </button>
                    </div>
                  </div>
                  <div class="product-removal mt-4">
                    <button class="btn btn-danger btn-sm w-100 remove-product">
                      <i class="fa-solid fa-trash-can me-2"></i>Remove
                    </button>
                  </div>
                  <div class="mt-2">
                    Product Total: $<span class="product-line-price">${(
                      price *
                      dampingRate *
                      amount
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
  
  productPanel.appendChild(card);
}


productPanel.addEventListener('click', (e) => {

  if (
    e.target.classList.contains('remove-product') ||
    e.target.classList.contains('fa-trash-can')
  ) {
    
    const card = e.target.closest('.card');
    const id = Number(card.dataset.id); 
    products = products.filter((item) => item.id !== id);

    localStorage.setItem('products', JSON.stringify(products));
   
    card.remove();
  }
  
  else if (
    e.target.classList.contains('increase') ||
    e.target.classList.contains('decrease')
  ) {
    
    const card = e.target.closest('.card');
    const id = Number(card.dataset.id); 
   
    const index = products.findIndex((item) => item.id === id);
    
    if (e.target.classList.contains('decrease')) {
    
      if (products[index].amount === 1) {
        if (confirm('You are about to remove this product! Are you sure?')) {
          
          products = products.filter((item) => item.id !== id);
          card.remove();
        }
      } else {
      
        products[index].amount--;
      }
    } else products[index].amount++;
    
    localStorage.setItem('products', JSON.stringify(products));

    card.querySelector('#product-quantity').textContent =
      products[index].amount;
    
    card.querySelector('.product-line-price').textContent = (
      products[index].amount *
      products[index].price *
      dampingRate
    ).toFixed(2);
  }
  calculateCardTotal();
});


function calculateCardTotal() {
  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.amount * dampingRate,
    0
  );
  const taxPrice = subtotal * taxRate;
  const shipping = subtotal > 0 ? shippingRate : 0;
  const cardTotal = subtotal + shipping + taxPrice;

  document.querySelector('.subtotal').textContent = subtotal.toFixed(2);
  document.querySelector('.tax').textContent = taxPrice.toFixed(2);
  document.querySelector('.shipping').textContent = shipping.toFixed(2);
  document.querySelector('.total').textContent = cardTotal.toFixed(2);
}


window.addEventListener('DOMContentLoaded', () => {
  getDataFromDatabase();
  renderAllProducts();
  calculateCardTotal();
});