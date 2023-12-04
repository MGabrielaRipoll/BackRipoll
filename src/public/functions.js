
async function addToCart(cartId, _id) {
    // first get the cart id from the session
    try {
        const url = 'http://localhost:8080/api/cart/cid'
        const options = {
            method: 'GET',
        }
        await fetch(url, options)
            .then((response) => {
            // evaluate the API response
            console.log(response);
            if (!response.ok) throw new Error(response.error)
            return response.json()
            })
            .then((data) => {
            const cartId = data.cartId
            const url = 'http://localhost:8080/api/cart/' + cartId + '/products/' + _id
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 })
            }
            fetch(url, options)
                .then((response) => {
                // evaluate the API response
                if (!response.ok) throw new Error(response.error)
                })
            })
        } catch (error) {
            console.log(error)
            return false
        }
}