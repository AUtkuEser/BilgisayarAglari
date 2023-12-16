import './bootstrap';
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import {AuthContextProvider, useAuth} from "./Contexts/AuthContext";

function Home() {
    return (
        <Main/>
    );
}

function App() {
    const {user} = useAuth();

    if (!user) {
        return (
            <Login/>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" index element={<Home/>}/>
                <Route path="/voltz" element={<Main/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const route = document.getElementById('root');
if (route !== null) {
    // createRoot(route).render(<App/>);

    createRoot(route).render((
        <AuthContextProvider>
            <App/>
        </AuthContextProvider>
    ))
}
