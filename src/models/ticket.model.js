import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code:{ type: String, required: true },
    // hora de compra
    purchase_date:{ type: Date, required: true, default: Date.now },
    // quantity
    amount:{ type: Number, required: true },
    // comprador
    purchaser: { type: String, required: true },
})

// populet del comprador

ticketSchema.pre("findOne", async function(next) {
    this.populate("purschaser")
    next()
})


export const Ticket  = model("Ticket", ticketSchema);