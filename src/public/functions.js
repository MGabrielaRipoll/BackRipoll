
// async function addToCart(cartId, _id) {
//     // first get the cart id from the session
//     try {
//         const url = 'http://localhost:8080/api/cart/cid'
//         const options = {
//             method: 'GET',
//         }
//         await fetch(url, options)
//             .then((response) => {
//             // evaluate the API response
//             console.log(response);
//             if (!response.ok) throw new Error(response.error)
//             return response.json()
//             })
//             .then((data) => {
//             const cartId = data.cartId
//             const url = 'http://localhost:8080/api/cart/' + cartId + '/products/' + _id
//             const options = {
//                 method: 'POST',
//                 headers: {
//                 'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ quantity: 1 })
//             }
//             fetch(url, options)
//                 .then((response) => {
//                 // evaluate the API response
//                 if (!response.ok) throw new Error(response.error)
//                 })
//             })
//         } catch (error) {
//             console.log(error)
//             return false
//         }
// }
async function addToCart(cartId, productId) {
    try {
        // Obtener el cartId desde la sesión o de donde sea necesario
        const cartIdFromSession = await fetchCartIdFromSession();
        
        // Comprobar si se obtuvo correctamente el cartId
        if (!cartIdFromSession) {
            console.error('No se pudo obtener el cartId');
            return false;
        }

        const url = `http://localhost:8080/api/cart/${cartIdFromSession}/products/${productId}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1 })
        };

        // Realizar la solicitud para agregar el producto al carrito
        const response = await fetch(url, options);

        // Evaluar la respuesta de la API
        if (!response.ok) {
            console.error('Error al agregar el producto al carrito:', response.statusText);
            return false;
        }

        console.log('Producto agregado al carrito con éxito');
        return true;

    } catch (error) {
        console.error('Error inesperado:', error);
        return false;
    }
}

async function fetchCartIdFromSession() {
    try {
        const url = 'http://localhost:8080/api/cart/cid';
        const response = await fetch(url);
        // Evaluar la respuesta de la API
        if (!response.ok) {
            console.error('Error al obtener el cartId:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data.cartId;

    } catch (error) {
        console.error('Error al obtener el cartId:', error);
        return null;
    }
}
