import { Ticket } from "../daos/MongoDB/ticketManager.mongo.js";





export const findById = (id) => {
    const ticket = Ticket.findById(id);
    return ticket;
};

export const findByEmail = (id) => {
    const ticket = Ticket.findByEmail(id);
    return ticket;
};

export const createOne = (obj) => {
    const createdTicket = Ticket.createOne(newObj);
    return createdTicket;
};