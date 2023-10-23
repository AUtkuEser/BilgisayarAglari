import './bootstrap';
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function Home() {
    return (
        <div>home page</div>
    );
}


function Deneme() {
    return (
        <div>deneme page</div>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" index element={<Home/>}/>
                <Route path="/deneme" element={<Deneme/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const route = document.getElementById('root');
if (route !== null) {
    createRoot(route).render(<App/>);
}
