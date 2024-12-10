import opts from "../utils/swaggerOpt.util.js";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

const specs = swaggerJsdoc(opts);

export default (app)=>{
    app.use("/api/docs", serve, setup(specs));
    console
}