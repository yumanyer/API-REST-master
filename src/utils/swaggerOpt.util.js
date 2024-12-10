import getDirname from "../dirname.js";
const opts ={
    definition:{
        openapi:'3.0.1',
        info:{
            title:'API REST',
            description:'API REST para el e-commerce',
            version:'1.0.0'
            
        }
    },
    apis: [`${getDirname()}/docs/*.yaml`]

}

export default opts;