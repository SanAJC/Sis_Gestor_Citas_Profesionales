import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RedirectGoogleAuth() {
    const navigate = useNavigate();
    const { setUsers } = useAuth();
    
    useEffect(() => {
        console.log("RedirectHandler mounted successfully");

        const queryParams = new URLSearchParams(window.location.search);
        const data = queryParams.get('data');

        if (data) {
            try {
                const payload = JSON.parse(decodeURIComponent(data));
                const { user, tokens } = payload;
                
                setUsers(user);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('access_token', tokens.access);
                localStorage.setItem('refresh_token', tokens.refresh);
                
                navigate('/app');
            } catch (error) {
                console.error('Error parsing data:', error);
            }
        }
        console.log("QueryParams: ", window.location.search);

        console.log("Data: ", data);
    }, [])

    return <div>Logging In.........</div>
}

export default RedirectGoogleAuth;