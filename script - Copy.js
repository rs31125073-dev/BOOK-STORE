// ===============================
// BOOKSTORE SHOPPING CART
// ===============================

let cart = [];

// ADD BOOK TO CART
function addToCart(bookName, price) {

    let existingBook = cart.find(book => book.name === bookName);

    if (existingBook) {
        existingBook.quantity++;
    } else {
        cart.push({
            name: bookName,
            price: Number(price),
            quantity: 1
        });
    }

    displayCart();
}

// DISPLAY CART
function displayCart() {

    let cartItems = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">🛒 Your cart is empty.</p>';

    } else {

        cart.forEach(function(book, index) {

            let subtotal = book.price * book.quantity;
            total += subtotal;

            let item = document.createElement("div");
            item.className = "cart-item";

            item.innerHTML = `
                <div class="cart-book-info">
                    <h4>📚 ${book.name}</h4>
                    <p>Price: $${book.price.toFixed(2)}</p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                </div>

                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">−</button>
                    <span>${book.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>

                <button class="remove-btn"
                onclick="removeFromCart(${index})">
                    Remove
                </button>
            `;

            cartItems.appendChild(item);
        });
    }

    totalPrice.innerHTML = "Total: $" + total.toFixed(2);
}

// UPDATE QUANTITY
function updateQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

// REMOVE BOOK
function removeFromCart(index) {

    cart.splice(index, 1);

    displayCart();
}

// INITIAL DISPLAY
displayCart();

// ===============================
// LOGIN AND SIGN UP
// ===============================

function showLogin() {
    document.getElementById("login-modal").style.display = "flex";
}

function showSignup() {
    document.getElementById("signup-modal").style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// CUSTOMER SIGN UP
function signup() {

    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPassword", password);
    localStorage.setItem("customerName", name);

    alert("Account created successfully!");

    closeModal("signup-modal");
}
// ===============================
// LOGIN
// ===============================

function login() {

    let role = document.getElementById("login-role").value;
    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value;

    // CUSTOMER LOGIN
    if (role === "customer") {

        let savedEmail = localStorage.getItem("customerEmail");
        let savedPassword = localStorage.getItem("customerPassword");

        if (
            email === savedEmail &&
            password === savedPassword &&
            savedEmail !== null
        ) {

            localStorage.setItem("userRole", "customer");

            alert("Welcome Customer!");

            closeModal("login-modal");

            showCustomerDashboard();

        } else {

            alert("Incorrect Customer Email or Password!");
        }
    }

    // STAFF LOGIN
    else if (role === "staff") {

        if (
            email === "staff@bookstore.com" &&
            password === "Staff123"
        ) {

            localStorage.setItem("userRole", "staff");

            alert("Welcome Staff!");

            closeModal("login-modal");

            showStaffDashboard();

        } else {

            alert("Incorrect Staff Email or Password!");
        }
    }
}

// ===============================
// CUSTOMER DASHBOARD
// ===============================

function showCustomerDashboard() {

    document.getElementById("home").style.display = "none";
    document.getElementById("books").style.display = "block";
    document.getElementById("cart").style.display = "block";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";

    document.getElementById("staff-dashboard").style.display = "none";

    document.getElementById("customer-dashboard").style.display = "block";

    document.getElementById("customer-dashboard-name").textContent =
        localStorage.getItem("customerName") || "Customer";

    document.getElementById("customer-dashboard-email").textContent =
        localStorage.getItem("customerEmail") || "";

    displayBooks();

    trackOrders();
}

// CUSTOMER BROWSE BOOKS
function showCustomerBooks() {

    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
}

// CUSTOMER VIEW ORDERS
function showCustomerOrders() {

    trackOrders();

    document.getElementById("customer-dashboard").scrollIntoView({
        behavior: "smooth"
    });
}

// ===============================
// STAFF DASHBOARD
// ===============================

function showStaffDashboard() {

    document.getElementById("home").style.display = "none";
    document.getElementById("books").style.display = "block";
    document.getElementById("cart").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";

    document.getElementById("customer-dashboard").style.display = "none";

    document.getElementById("staff-dashboard").style.display = "block";

    document.getElementById("orders-panel").style.display = "none";
    document.getElementById("add-book-form").style.display = "none";

    displayBooks();
}

// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("userRole");

    document.getElementById("staff-dashboard").style.display = "none";
    document.getElementById("customer-dashboard").style.display = "none";

    document.getElementById("home").style.display = "block";
    document.getElementById("books").style.display = "block";
    document.getElementById("cart").style.display = "block";
    document.getElementById("about").style.display = "block";
    document.getElementById("contact").style.display = "block";

    document.getElementById("orders-panel").style.display = "none";
    document.getElementById("add-book-form").style.display = "none";

    document.getElementById("my-orders").innerHTML = "";

    displayBooks();

    alert("You have logged out!");
}
// ===============================
// ADD NEW BOOK
// ===============================

function showAddBook() {

    document.getElementById("orders-panel").style.display = "none";

    document.getElementById("add-book-form").style.display = "block";

    document.getElementById("add-book-form").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function addNewBook() {

    if (localStorage.getItem("userRole") !== "staff") {
        alert("Staff access only!");
        return;
    }

    let name = document.getElementById("book-name").value.trim();
    let author = document.getElementById("book-author").value.trim();
    let price = Number(document.getElementById("book-price").value);
    let category = document.getElementById("book-category").value;

    if (name === "" || author === "" || !Number.isFinite(price) || price <= 0) {
        alert("Please enter valid book information!");
        return;
    }

    let books = JSON.parse(localStorage.getItem("books")) || [];

    let newBook = {
        id: Date.now(),
        name: name,
        author: author,
        price: price,
        category: category
    };

    books.push(newBook);

    localStorage.setItem("books", JSON.stringify(books));

    alert("Book saved successfully!");

    document.getElementById("book-name").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-price").value = "";

    document.getElementById("add-book-form").style.display = "none";
 displayBooks();
}

function displayBooks(searchTerm = "", category = "All") {

    let books = JSON.parse(localStorage.getItem("books")) || [];

    let container = document.getElementById("book-list");

    if (!container) return;

    container.innerHTML = "";

    let filteredBooks = books.filter(function(book) {

        let matchesName = book.name.toLowerCase()
            .includes(searchTerm.toLowerCase());

        let matchesCategory = category === "All" ||
            book.category === category;

        return matchesName && matchesCategory;
    });

    if (filteredBooks.length === 0) {
        container.innerHTML = "<p>No books found!</p>";
        return;
    }

    filteredBooks.forEach(function(book) {

        let card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
            <h3>${book.name}</h3>
            <p>${book.author}</p>
            <p>Category: ${book.category || "Uncategorized"}</p>
            <h4>$${Number(book.price).toFixed(2)}</h4>

            <button class="add-cart-btn">Add to Cart</button>

            ${localStorage.getItem("userRole") === "staff" ? `
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            ` : ""}
        `;

        card.querySelector(".add-cart-btn").onclick = function() {
            addToCart(book.name, book.price);
        };

        container.appendChild(card);
    });
}

// BOOK SEARCH
function searchBooks() {

    let searchTerm = document.getElementById("book-search").value;

    let category = document.getElementById("category-filter").value;

    displayBooks(searchTerm, category);
}

// CATEGORY FILTER
function filterBooks() {

    let category = document.getElementById("category-filter").value;

    let searchTerm = document.getElementById("book-search").value;

    displayBooks(searchTerm, category);
}

function searchBooks() {

    let searchTerm = document.getElementById("book-search").value;

    displayBooks(searchTerm);
}

// ===============================
// ORDER STORAGE
// ===============================

function getOrders() {

    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {

    localStorage.setItem("orders", JSON.stringify(orders));
}

// ===============================
// STAFF VIEW ORDERS
// ===============================

function viewOrders() {

    if (localStorage.getItem("userRole") !== "staff") {
        alert("Staff access only!");
        return;
    }

    document.getElementById("add-book-form").style.display = "none";

    let panel = document.getElementById("orders-panel");

    panel.style.display = "block";

    let ordersList = document.getElementById("orders-list");

    ordersList.innerHTML = "<h3>Customer Orders</h3>";

    let orders = getOrders();

    if (orders.length === 0) {

        ordersList.innerHTML += "<p>No orders yet.</p>";

        return;
    }

    orders.forEach(function(order) {

        let orderBox = document.createElement("div");

        orderBox.className = "order-card";

        let title = document.createElement("h4");
        title.textContent = "Order #" + order.id;

        let customer = document.createElement("p");
        customer.textContent = "Customer: " + order.customer;

        let email = document.createElement("p");
        email.textContent = "Email: " + order.email;

        let date = document.createElement("p");
        date.textContent = "Date: " + order.date;
        let books = document.createElement("p");

    books.textContent = "Books: " +
    order.items.map(book =>
        book.name + " (x" + book.quantity + ")"
    ).join(", ");

        

        let total = document.createElement("h4");

        total.textContent = "Total: $" + order.total.toFixed(2);

        let status = document.createElement("span");

status.className = "status-badge " +
    order.status.toLowerCase();

status.textContent = order.status;

        orderBox.append(
            title,
            customer,
            email,
            date,
            books,
            total,
            status
        );

        // APPROVE ORDER BUTTON

        if (order.status === "Pending") {

            let approveBtn = document.createElement("button");

            approveBtn.textContent = "Approve Order";

            approveBtn.onclick = function() {

                let allOrders = getOrders();

                let index = allOrders.findIndex(
                    o => o.id === order.id
                );

                if (index !== -1) {

                    allOrders[index].status = "Approved";

                    saveOrders(allOrders);

                    alert("Order Approved!");

                    viewOrders();
                }
            };

            orderBox.appendChild(approveBtn);
        }

        // DELIVER ORDER BUTTON

        if (order.status === "Approved") {

            let deliverBtn = document.createElement("button");

            deliverBtn.textContent = "✓ Mark as Delivered";
            
            deliverBtn.className = "deliver-btn";

            deliverBtn.onclick = function() {

                let allOrders = getOrders();

                let index = allOrders.findIndex(
                    o => o.id === order.id
                );

                if (index !== -1) {

                    allOrders[index].status = "Delivered";

                    saveOrders(allOrders);

                    alert("Order Delivered!");

                    viewOrders();
                }
            };

            orderBox.appendChild(deliverBtn);
        }

        ordersList.appendChild(orderBox);

    });

    panel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// ===============================
// PLACE CUSTOMER ORDER
// ===============================

function placeOrder() {

    if (localStorage.getItem("userRole") !== "customer") {

        alert("Please login as a customer first!");

        showLogin();

        return;
    }

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let orders = getOrders();

    let total = 0;

cart.forEach(function(book) {
    total += book.price * book.quantity;
});

    let order = {

        id: Date.now(),

        customer: localStorage.getItem("customerName"),

        email: localStorage.getItem("customerEmail"),

        items: [...cart],

        total: total,

        status: "Pending",

        date: new Date().toLocaleString()
    };

    orders.push(order);

    saveOrders(orders);

    cart = [];

    displayCart();

    alert("Your order has been placed successfully!");
}

// ===============================
// TRACK CUSTOMER ORDERS
// ===============================
function trackOrders() {

    if (localStorage.getItem("userRole") !== "customer") {
        alert("Please login as a customer first!");
        showLogin();
        return;
    }

    let email = localStorage.getItem("customerEmail");
    let orders = getOrders();

    let myOrders = orders.filter(order =>
        order.email === email
    );

    let result = document.getElementById("my-orders");

    result.innerHTML = "<h3>My Orders</h3>";

    if (myOrders.length === 0) {
        result.innerHTML +=
            "<p>You have not placed any orders yet.</p>";
        return;
    }

    myOrders.reverse().forEach(function(order) {

        let item = document.createElement("div");
        item.className = "order-card";

        let books = order.items.map(book =>
            `${book.name} × ${book.quantity}`
        ).join(", ");

        let statusClass = order.status.toLowerCase();

        item.innerHTML = `
            <h4>Order #${order.id}</h4>
            <p><strong>Books:</strong> ${books}</p>
            <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
            <p><strong>Date:</strong> ${order.date}</p>

            <div class="customer-order-status ${statusClass}">
                ${order.status}
            </div>
        `;

        result.appendChild(item);
    });
}
displayBooks();

// EDIT AND DELETE BOOKS

function editBook(id) {

    if (localStorage.getItem("userRole") !== "staff") {
    alert("Staff access only!");
    return;
}
    let books = JSON.parse(localStorage.getItem("books")) || [];

    let book = books.find(function(b) {
        return b.id === id;
    });

    if (!book) return;

    let newName = prompt("Enter new book name:", book.name);

    if (newName === null || newName.trim() === "") return;

    let newAuthor = prompt("Enter new author:", book.author);

    if (newAuthor === null || newAuthor.trim() === "") return;

    let newPrice = Number(prompt("Enter new price:", book.price));

    if (!Number.isFinite(newPrice) || newPrice <= 0) {
        alert("Invalid price!");
        return;
    }

    book.name = newName.trim();
    book.author = newAuthor.trim();
    book.price = newPrice;

    localStorage.setItem("books", JSON.stringify(books));

    displayBooks();

    alert("Book updated successfully!");
}
// ===============================
// DELETE BOOK
// ===============================

function deleteBook(id) {

    if (localStorage.getItem("userRole") !== "staff") {
        alert("Staff access only!");
        return;
    }

    let confirmDelete = confirm("Are you sure you want to delete this book?");

    if (!confirmDelete) return;

    let books = JSON.parse(localStorage.getItem("books")) || [];

    books = books.filter(function(book) {
        return book.id !== id;
    });

    localStorage.setItem("books", JSON.stringify(books));

    displayBooks();

    alert("Book deleted successfully!");
}
// ===============================
// CATEGORY FILTER
// ===============================

function filterBooks() {

    let category = document.getElementById("category-filter").value;

    let searchTerm = document.getElementById("book-search").value;

    displayBooks(searchTerm, category);
}