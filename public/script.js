document.addEventListener("DOMContentLoaded", function() {
    let addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartItems = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");
    const addItemForm = document.getElementById("add-item-form");
  
    const API_URL = "";
  
    function fetchItems() {
      fetch(`${API_URL}/items`)
        .then(response => response.json())
        .then(data => {
          data.forEach(item => {
            const newItem = document.createElement("div");
            newItem.className = "item";
            newItem.innerHTML = `
              <img src="${item.itemImage}" alt="${item.itemName}">
              <h3>${item.itemName}</h3>
              <p>$${item.itemPrice}</p>
              <button class="add-to-cart">Add to Cart</button>
            `;
            document.querySelector(".grid").appendChild(newItem);
            addToCartButtons = document.querySelectorAll(".add-to-cart");
            addToCartButtons.forEach(function(button) {
                button.addEventListener("click", function() {
                  const item = button.parentNode;
                  const itemName = item.querySelector("h3").innerText;
                  const itemPrice = parseFloat(item.querySelector("p").innerText.replace("$", ""));
                  addToCart(itemName, itemPrice);
                });
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
          cartItems.innerHTML = "";
          data.forEach(item => {
            const li = document.createElement("li");
            li.innerText = `${item.itemName} - $${item.itemPrice} x ${item.quantity}`;
            cartItems.appendChild(li);
          });
        })
        .catch(error => {
          console.error("Error fetching cart items: ", error);
        });
    }
  
    function addToCart(itemName, itemPrice) {
      fetch(`${API_URL}/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itemName: itemName,
          itemPrice: itemPrice
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
  
      const itemName = itemNameInput.value;
      const itemPrice = parseFloat(itemPriceInput.value);
  
      addToCart(itemName, itemPrice);
  
      itemNameInput.value = "";
      itemPriceInput.value = "";
    });
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
            li.innerText = `Order ID: ${order.id}, Total: $${order.total}, Date: ${order.date}`;
            orderList.appendChild(li);
          });
        })
        .catch(error => {
          console.error("Error fetching orders: ", error);
        });
    }
    
    fetchOrders();
    

  });
  
 
  