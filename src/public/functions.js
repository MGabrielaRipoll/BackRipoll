
const addToCart = async (cartId, _id) => {
    const url = `http://localhost:8080/api/cart/${cartId}/products/${_id}`;
    const data = {
        cartId: cartId,
        _id: _id,

    };

    console.log("cart", cartId, "product", _id);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error adding product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Product added to cart:", result);
    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};

