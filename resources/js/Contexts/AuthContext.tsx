import {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import axios from "axios";


interface ContextType {
    user: any;
    setUser: (user: any) => void;
    login: (email: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext: Context<ContextType> = createContext<ContextType>(
    {} as ContextType,
);

export const useAuth = () => useContext<ContextType>(AuthContext);

export function AuthContextProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<any>(null);

    const login = async (email: string, password: string) => {
        const response = await axios.post('/api/auth', {
            email,
            password,
        });

        if (response.data.success){
            setUser(response.data.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
            localStorage.setItem('user', JSON.stringify(response));
            return true;
        }
        return false;
    };

    const register = async (username: string, email: string, password: string) => {
        const response = await axios.post('/api/register', {
            username,
            email,
            password,
        });

        if (response.data.success){
            setUser(response.data.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
            localStorage.setItem('user', JSON.stringify(response));
            return true;
        }
        return false;
    }

    const logout = () => {
        setUser(null);
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('user');
    };


    useEffect(() => {
        const data = localStorage.getItem('user');

        if (data) {
            const object = JSON.parse(data);
            setUser(object);
            axios.defaults.headers.common['Authorization'] = `Bearer ${object.data.data.token}`;
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
