const errors =  {
    error: {message: "Error del cliente", status: 400},
    authError: {message: "Credenciales inválidas", status: 401},
    forbidden: {message: "Acción prohibida", status: 403},
    notFound: {message: "No encontrado", status: 404},
    serverError: {message: "Error del servidor", status: 500},
    badRequest: {message: "Solicitud incorrecta", status: 400},
}

export default errors