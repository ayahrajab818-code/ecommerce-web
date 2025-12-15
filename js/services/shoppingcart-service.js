let cartService;

class ShoppingCartService {

    cart = {
        items:[],
        total:0
    };

    addToCart(productId) {
        const url = `${config.baseUrl}/cart/products/${productId}`;
        const headers = userService.getHeaders();

        axios.post(url, null, { headers })
            .then(() => {
                // POST returns 204, so refresh cart with GET
                return this.loadCart();
            })
            .catch(() => {
                templateBuilder.append("error", { error: "Add to cart failed." }, "errors");
            });
    }

    loadCart() {
        const url = `${config.baseUrl}/cart`;
        const headers = userService.getHeaders();

        return axios.get(url, { headers })
            .then(response => {
                this.setCart(response.data);
                this.updateCartDisplay();
            })
            .catch(() => {
                templateBuilder.append("error", { error: "Load cart failed." }, "errors");
            });
    }

    clearCart() {
        const url = `${config.baseUrl}/cart`;
        const headers = userService.getHeaders();

        axios.delete(url, { headers })
            .then(() => {
                // DELETE returns 204, so refresh cart with GET
                this.cart = { items: [], total: 0 };
                this.updateCartDisplay();
                return this.loadCart();
            })
            .then(() => this.loadCartPage())
            .catch(() => {
                templateBuilder.append("error", { error: "Empty cart failed." }, "errors");
            });
    }

    updateCartDisplay()
    {
        try {
            const itemCount = this.cart.items.length;
            const cartControl = document.getElementById("cart-items")

            cartControl.innerText = itemCount;
        }
        catch (e) {

        }
    }
}





document.addEventListener('DOMContentLoaded', () => {
    cartService = new ShoppingCartService();

    if(userService.isLoggedIn())
    {
        cartService.loadCart();
    }

});
