import { Users } from "../DAL/daos/MongoDB/usersManager.mongo.js";
import { hashData } from "../utils/utils.js";
import UsersResponse from "../DAL/dtos/users-response.dto.js";


export const findAll = () => {
    const user = Users.findAll();
    return user;
};

export const findById = (id) => {
    const user = Users.findById(id);
    return user;
};

export const deleteOneUser = (id) => {
    const user = Users.deleteOne(id);
    return user;
};


export const findByEmail = (id) => {
    const user = Users.findByEmail(id);
    return user;
};


export const updateUser = async (id, obj) => {
    try {

        const userModific = await Users.updateOne({ _id: id }, obj);
        return userModific;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

export const updatePerfilDoc = async (id, {dni, address, bank}) => {
    const userDocument = await Users.updateOne(id, {
        documents: [
            ...dni?[{
                name: "dni",
                reference: dni[0].path,
            }]:[],
            ...address?[{
                name: "address",
                reference: address[0].path,
            }]:[],
            ...bank?[{
                name: "bank",
                reference: bank[0].path,
            }]:[],
        ],
    });
    return userDocument;
}

export const updatePerfilFoto = async (id, {foto}) => {
    console.log(foto, "que onda");
    const userPerfil = await Users.updateOne(id, {
        avatar: [
            ...foto?[{
                name: "foto",
                reference: foto[0].path,
            }]:[],
        ]
    });
    return userPerfil;
} 
export const createOne = (obj) => {
    const hashedPassword = hashData(obj.password);
    const newObj = { ...obj, password: hashedPassword };
    const createdUser = Users.createOne(newObj);
    return createdUser;
};

