
const deleteOne = async (cid, _id, product) => {
    const cartId = document.getElementById('cid').value;

    const url = `http://localhost:8080/api/cart/${cartId}/products/${product._id}`;
    const data = {
        cid: cid,  // Use the parameter cid here
        _id: product._id,
    };

    console.log("cartId", cartId, "product", _id);

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error in delete product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Product delete to cart:", result);
    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};


const addProductToCart = async (cid, _id, product) => {
    const cartId = document.getElementById('cid').value;

    const url = `http://localhost:8080/api/cart/${cartId}/products/${product._id}`;
    const data = {
        cid: cid,  // Use the parameter cid here
        _id: product._id,
    };

    console.log("cartId", cartId, "product", _id);

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
            console.error("Error in added product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Product add to cart:", result);
    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};

const deleteAll = async (cid) => {
    const cartId = document.getElementById('cid').value;

    const url = `http://localhost:8080/api/cart/${cartId}`;
    const data = {
        cid: cid,  
    };

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error in delete to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log(" delete to cart:", result);
    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};