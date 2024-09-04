import { Ticket } from "../models/ticket.model.js";

export class TicketRepository {
    
    // GET TICKET BY ID
    async findById(id) {
        try {
            return await Ticket.findById(id).exec();
        } catch (error) {
            throw new Error(`Error al encontrar el ticket: ${error.message}`);
        }
    }   

    // POST TICKET  
    async create(data) {
        try {
            const ticket = new Ticket(data);
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    // PUT TICKET
    async update(id, data) {
        try {
            return await Ticket.findByIdAndUpdate(id, data, { new: true }).exec();
        } catch (error) {
            throw new Error(`Error al actualizar el ticket: ${error.message}`);
        }
    }

    // DELETE TICKET BY ID
    async delete(id) {
        try {
            return await Ticket.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new Error(`Error al eliminar el ticket: ${error.message}`);
        }
    }

    // GET TICKET
    async findAll() {
        try {
            return await Ticket.find().exec();
        } catch (error) {
            throw new Error(`Error al encontrar los tickets: ${error.message}`);
        }
    }      
}