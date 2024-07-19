class ApiResponse {
    constructor(statusCode, data, message = "Success" , token = undefined){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
        this.token = token
    }
}

export { ApiResponse }