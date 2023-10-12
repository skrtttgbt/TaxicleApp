import { createContext, useState } from "react"

const AuthContext = createContext({})

export const LoginAuth = ({isAuthenticated}) =>  {

    return(
        <AuthContext.Provider value={{isAuthenticated}}>
            
        </AuthContext.Provider>
    )
}
export default AuthContext