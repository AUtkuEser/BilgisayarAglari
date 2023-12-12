import './bootstrap';
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function Home() {
    return (
        <div className={""}>
            <div>
                home page
            </div>
        </div>
    );
}



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" index element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const route = document.getElementById('root');
if (route !== null) {
    createRoot(route).render(<App/>);
}
