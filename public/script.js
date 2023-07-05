document.addEventListener("DOMContentLoaded", function() {
    let addToCartButtons = document.querySelectorAll(".add-to-cart");
    let deleteFromCartButtons = document.querySelectorAll(".delete");
    const cartItems = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");
    const addItemForm = document.getElementById("add-item-form");
  
    const API_URL = "";
  
    function fetchItems() {
      const grid = document.querySelector(".grid");
      grid.innerHTML = "";
      fetch(`${API_URL}/items`)
        .then(response => response.json())
        .then(data => {
          data.forEach(item => {
            const newItem = document.createElement("div");
            newItem.className = "item";
            newItem.innerHTML = `
              <img src="${item.itemImage}" alt="${item.itemName}">
              <h3>${item.itemName}</h3>
              <p>Rs${item.itemPrice}</p>
              <p class="item-id">${item.id}</p>
              <select id="qty_drop"> 
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5/option>
              </select>
              <button class="add-to-cart">Add to Cart</button>
            
            `;
            document.querySelector(".grid").appendChild(newItem);
          });
          addToCartButtons = document.querySelectorAll(".add-to-cart");
            addToCartButtons.forEach(function(button) {
                
                button.addEventListener("click", function() {
                  const item = button.parentNode;
                  const itemName = item.querySelector("h3").innerText;
                  const itemPrice = parseFloat(item.querySelector("p").innerText.replace("Rs", ""));
                  const itemId = item.querySelector(".item-id").innerText;
                  const itemQty = item.querySelector("#qty_drop").value;
                  addToCart(itemId, itemName, itemPrice, itemQty);
                });
              });
        })
        .catch(error => {
          console.error("Error fetching items: ", error);
        });
        addToCartButtons = document.querySelector(".add-to-cart");
    }
  
    function fetchCartItems() {
      fetch(`${API_URL}/cart-items`)
        .then(response => response.json())
        .then(data => {
          if (data.length == 0){
            cartItems.innerHTML = "Cart is empty";
          } else {
            cartItems.innerHTML = "";
            data.forEach(item => {
              const li = document.createElement("li");
              li.classList.add('cart-item')
              li.innerHTML = `<p class="item-id-cart">${item.itemId}</p> ${item.itemName} - Rs${item.itemPrice} x ${item.quantity} <button class="delete">X</button>`;
              cartItems.appendChild(li);
            });
            deleteFromCartButtons = document.querySelectorAll(".delete");
            deleteFromCartButtons.forEach(function(button) {
                
                button.addEventListener("click", function() {
                  const item = button.parentNode;
                  const itemId = item.querySelector(".item-id-cart").innerText;
                  deleteFromCart(itemId);
                });
              });
          }
        })
        .catch(error => {
          console.error("Error fetching cart items: ", error);
        });
    }
  
    function addToCart(itemId,itemName, itemPrice, itemQty) {
      fetch(`${API_URL}/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itemId: itemId,
          itemName: itemName,
          itemPrice: itemPrice,
          itemQty: itemQty
        })
      })
        .then(response => {
          if (response.ok) {
            fetchCartItems();
          } else {
            console.error("Error adding item to cart.");
          }
        })
        .catch(error => {
          console.error("Error adding item to cart: ", error);
        });
    }

    function deleteFromCart(itemId){
      fetch(`${API_URL}/delete-item-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itemId: itemId
        })
      })
        .then(response => {
          if (response.ok) {
            fetchCartItems();
          } else {
            console.error("Error adding item to cart.");
          }
        })
        .catch(error => {
          console.error("Error adding item to cart: ", error);
        });
    }
  

  
    checkoutBtn.addEventListener("click", function() {
      generateBill();
    });
  
    addItemForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const itemNameInput = document.getElementById("item-name");
      const itemPriceInput = document.getElementById("item-price");
      const itemImageInput = document.getElementById("item-image");

      const itemName = itemNameInput.value;
      const itemPrice = parseFloat(itemPriceInput.value);
      const itemImage = itemImageInput.value;
  
      addItem(itemName, itemPrice, itemImage);
  
      itemNameInput.value = "";
      itemPriceInput.value = "";
      itemImageInput.value = "";
    });

    function addItem(itemName, itemPrice, itemImage){
      fetch(`${API_URL}/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itemName: itemName,
          itemPrice: itemPrice,
          itemImage: itemImage
        })
      })
        .then(response => {
          if (response.ok) {
            fetchItems();
          } else {
            console.error("Error adding item to cart.");
          }
        })
        .catch(error => {
          console.error("Error adding item to cart: ", error);
        });
    }
      // ...
      
      function generateBill() {
        fetch(`${API_URL}/cart-items`)
          .then(response => response.json())
          .then(data => {
            if (data.length === 0) {
              alert("Your cart is empty.");
              return;
            }
      
            fetch(`${API_URL}/checkout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                items: data
              })
            })
              .then(response => {
                if (response.ok) {
                  alert("Bill generated and cart cleared.");
                  cartItems.innerHTML = "";
                  fetchOrders();
                } else {
                  console.error("Error generating bill.");
                }
              })
              .catch(error => {
                console.error("Error generating bill: ", error);
              });
          })
          .catch(error => {
            console.error("Error fetching cart items: ", error);
          });
      }
    fetchItems();
    fetchCartItems();


    const orderList = document.getElementById("orderList");

    function fetchOrders() {
      fetch(`${API_URL}/orders`)
        .then(response => response.json())
        .then(data => {
          orderList.innerHTML = "";
          data.forEach(order => {
            const li = document.createElement("li");
            li.innerText = `Order ID: ${order.id}, Total: Rs${order.total}, Date: ${order.date}`;
            orderList.appendChild(li);
          });
        })
        .catch(error => {
          console.error("Error fetching orders: ", error);
        });
    }
    
    fetchOrders();
    

  });