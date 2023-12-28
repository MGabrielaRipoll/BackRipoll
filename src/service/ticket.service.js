import { Ticket } from "../DAL/daos/MongoDB/ticketManager.mongo.js";





export const findById = (id) => {
    const ticket = Ticket.findById(id);
    return ticket;
};

export const findByEmail = (id) => {
    const ticket = Ticket.findByEmail(id);
    return ticket;
};

export const createOneT = (obj) => {
    const createdTicket = Ticket.createOne(obj);
    return createdTicket;
};