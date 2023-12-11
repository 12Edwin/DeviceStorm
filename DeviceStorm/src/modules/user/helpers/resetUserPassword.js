import api from '../../../config/http'

export const resetPassword = async(credentials) =>{
    try {
        const response = await api.doPost('/auth/new-password/', credentials)
        return response
    } catch (error) {
        return error
    }
}