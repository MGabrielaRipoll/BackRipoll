
const restaurarviamail = async (paramEmail) =>{
    const token = document.getElementById('token').value;    
    const email = document.getElementById('email').value;
    const url = `http://localhost:8080/api/session/restaurarviamail`;
    const data = {
        email: email,
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,        
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Error al enviar el mail:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        if (result.success) {
            form.reset(); 
        }
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

const restaurar = async () =>{
    const token = document.getElementById('token').value;    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("token",token);
    const url = `http://localhost:8080/api/session/restaurar`;
    const data = {
        email: email,
        password: password,
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,        
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Fail:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        if (result.success) {
            form.reset(); 
        }
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

const addToCart = async (cartId, _id) => {
    const id = document.getElementById('pid').value;
    const url = `http://localhost:8080/api/cart/${cartId}/products/${id}`;
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
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You cannot add your own product to the cart.',
            });
            // console.error("Error adding product to cart:", response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Product Added',
            text: 'The product has been added to your cart successfully.',
        });
        const result = await response.json();
        location.reload(true);

    } catch (error) {
        console.error("Fetch error:", error.message);
    }
};


const deleteOne = async (cartId, _id) => {
    const cid = document.getElementById('cartId').value;
    const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this product from your cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#d33', 
        reverseButtons: true
    });

    if (!confirmResult.isConfirmed) {
        return; 
    }

    const url = `http://localhost:8080/api/cart/${cid}/products/${_id}`;
    const data = {
        cartId: cartId,  
        _id: _id,
    };


    try {
        const response = await fetch( url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Error in delete product to cart:", response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Product Deleted',
            text: 'The product has been successfully deleted from your cart.',
        });

        const result = await response.json();
        location.reload(true);

    } catch (error) {
        console.error("Fetch error:", error.message);
    }
};


const addProductToCart = async (cartId, _id) => {
    const cid = document.getElementById('cartId').value;

    const url = `http://localhost:8080/api/cart/${cid}/products/${_id}`;
    const data = {
        cartId: cid, 
        _id: _id,
    };

    try {
        const response = await fetch( url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You cannot add your own product to the cart.',
            });
            // console.error("Error in added product to cart:", response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Product Added',
            text: 'The product has been added to your cart successfully.',
        });
        const result = await response.json();
        location.reload(true);

    } catch (error) {
        console.error("Fetch error:", error.message);
    }
};

const deleteAll = async (cartId) => {
    const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete alls product from your cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete all!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#d33', 
        reverseButtons: true
    });

    if (!confirmResult.isConfirmed) {
        return; 
    }
    const url = `http://localhost:8080/api/cart/${cartId}`;
    const data = {
        cartId: cartId,  
    };

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Error in delete to cart:", response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Product Delette',
            text: 'The products has been successfully deleted from your cart.',
        });
        const result = await response.json();
        location.reload(true);

    } catch (error) {
        console.error("Fetch error:", error.message);
    }
};

const createOneProduc = async () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const code = document.getElementById('code').value;
    const category = document.getElementById('category').value;
    const thumbail = document.getElementById('thumbail').value;
    const token = document.getElementById('token').value;
    const data = {
        title: title,
        description: description,
        price: price,
        stock: stock,
        code: code,
        category: category,
        thumbail: thumbail
    };
    const url = 'http://localhost:8080/api/products/';
    try {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,        
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        console.error("Error in add the product:", response.status, response.statusText);
        return;
    }
    Swal.fire({
        icon: 'success',
        title: 'Product Created',
        text: 'The product has been successfully created.',
        confirmButtonColor: '#28a745'
    });
    const result = await response.json();
    location.reload(true);

    } catch (error) {
    console.error("Fetch error:", error.message);
}
};

const deleteUser = async (users1) => {
    const usersOld = JSON.parse(document.getElementById('users1').value);
    const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete user.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete all!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#d33', 
        reverseButtons: true
    });

    if (!confirmResult.isConfirmed) {
        return; 
    }
    const url = `http://localhost:8080/api/users`;
    data = {
        users: usersOld
    }
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
            if (!response.ok) {
                console.error("Error in eliminacion the users:", response.status, response.statusText);
                return;
            }
            Swal.fire({
                icon: 'success',
                title: 'User Delette',
                text: 'The user has been successfully deleted.',
            });
            const result = await response.json();
        
        } catch (error) {
            console.error("Fetch error:", error.message);        
        }
    }


const deleteOneProdAll = async () => {
    const id = document.getElementById('id').value;
    const token = document.getElementById('token').value;
    const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this product.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete all!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#d33', 
        reverseButtons: true
    });

    if (!confirmResult.isConfirmed) {
        return; 
    }
    const url = `http://localhost:8080/api/products/${id}`;
    try {
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,        
        },
        body: JSON.stringify({ id: id }),
    });
    if (!response.ok) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'You cannot delete a product you have not added.',
        });
        // console.error("Error in eliminacion the product:", response.status, response.statusText);
        return;
    }
    Swal.fire({
        icon: 'success',
        title: 'Product Delette',
        text: 'The product has been successfully deleted.',
    });
    const result = await response.json();
    location.reload(true);
    } catch (error) {
        console.error("Fetch error:", error.message);        
    }
}

async function changeUserRole(uid) {
    const email = document.getElementById('email').value;
    const userid = document.getElementById('uid').value;
    const selectedRole = document.getElementById('role').value;
    try {
        const response = await fetch(`/api/users/premium/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: selectedRole , email: email }),
        });

        if (!response.ok) {
            console.error('Error changing role:', response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Product Created',
            text: 'Role changed successfully',
            confirmButtonColor: '#28a745'
        });
        const result = await response.json();
        location.reload(true);

    } catch (error) {
        console.error('Request error:', error.message);
    }
}
async function changeRole(uid) {
    const email = document.getElementById('email').value;
    const userid = document.getElementById('uid').value;
    const selectedRole = document.getElementById('role').value;
    try {
        const response = await fetch(`/api/users/premium/${userid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: selectedRole , email: email }),
        });
        if (!response.ok) {
            console.error('Error changing role:', response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Product Created',
            text: 'Role changed successfully',
            confirmButtonColor: '#28a745'
        });   
        const result = await response.json();
        location.reload(true);

    } catch (error) {
        console.error('Request error:', error.message);
    }
}
async function buy (cartId) {
    const token = document.getElementById('token').value;
    try {
        const response = await fetch(`/api/cart/${cartId}/purchase`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,       
            },
        });

        if (!response.ok) {
            console.error('Error', response.status, response.statusText);
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Purchase Successful',
            text: 'Your purchase was successful. Thank you!',
            confirmButtonColor: '#28a745', 
        });
        const result = await response.json();
    } catch (error) {
        console.error('Request error:', error.message);
    }   
}