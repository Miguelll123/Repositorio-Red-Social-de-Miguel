import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({children}){
   
    const {user,token} = useSelector((state)=>state.auth)

    if(user && token) {
        return <Navigate to='/dashboard' replace />
    }

    return children 
}