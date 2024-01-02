// @ts-ignore
import logo from '../../assets/Voltz_Logo_Siyah.png'
import React, {SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "../Contexts/AuthContext";

export default function Login() {
    const {login, register} = useAuth();
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('password');

    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');


    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    //Kullanıcı adı veya parola yanlış. -- Kullanıcı adı veya e-posta zaten kullanılıyor. -- Parolalar eşleşmiyor.

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 max-sm:p-12 max-xl:p-16 bg-gradient-to-tr from-slate-100 to-purple-200 relative">
            <div className={"w-[20%] max-lg:w-[30%] max-md:w-[40%] max-sm:w-[50%] max absolute top-10 max-sm:top-20 max-xl:block hidden"}>
                <img src={logo} alt="logos" className={""}/>
            </div>
            <div className="bg-white shadow-xl w-3/5 max-md:w-full rounded flex justify-between max-xl:justify-center items-center p-10">

                <div className="flex flex-col items-center justify-center w-3/5 max-xl:hidden">
                    <img
                        src={logo}
                        style={{pointerEvents: "none"}}
                        alt="logo"
                        className="w-3/5"/>
                </div>

                {isLogin? (
                    <div className={`flex flex-col items-center justify-center gap-5 w-2/5 max-xl:w-full`}>
                        <div className="text-5xl max-sm:text-3xl mb-10 max-sm:mb-4 font-extralight"
                             style={{fontFamily: "Montserrat", userSelect: "none"}}>Giriş Yap
                        </div>
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="text-md max-sm:text-xs mb-2 flex"
                                 style={{fontFamily: "Montserrat", userSelect: "none"}}>
                                Henüz üye değil misiniz?
                                <div
                                    className="font-semibold text-purple-700 cursor-pointer hover:text-purple-600 ml-2 transition duration-300"
                                    style={{userSelect: "none"}}
                                    onClick={() => {
                                        setIsLogin(false)
                                    }}>
                                    Kayıt Ol
                                </div>
                            </div>

                            <input
                                type="email"
                                placeholder="E-Posta"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                // ref={emailRef}
                                className="rounded-lg h-12 p-2 pl-4 w-full bg-[#F8F8F8] focus:border border-purple-700 text-[#2d2d2d] hover:bg-gray-100 focus:outline-0 focus:bg-gray-100 transition duration-300"
                                style={{fontFamily: "Montserrat"}}
                            />
                        </div>

                        <input
                            type="password"
                            placeholder="Parola"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // ref={passwordRef}
                            className="rounded-lg h-12 p-2 pl-4 w-full bg-[#F8F8F8] focus:border border-purple-700 text-[#2d2d2d] hover:bg-gray-100 focus:outline-0 focus:bg-gray-100 transition duration-300"
                            style={{fontFamily: "Montserrat"}}
                        />

                        {/*Hata mesajı*/}
                        <div className={"w-full"}>
                            <div className={`text-sm text-[#D61C4E]`}>{errorMessage}</div>
                        </div>
                        {/*Hata mesajı bitişi*/}
                        <button
                            className="bg-purple-700 rounded-lg p-2 m-2 w-full text-xl text-white font-semibold hover:bg-purple-800 hover:shadow-lg transition duration-300"
                            style={{fontFamily: "Montserrat"}}
                            onClick={() => {
                                login(email, password).catch(() => {
                                    setErrorMessage("E-posta veya parola yanlış.");
                                });
                            }}
                        >Giriş Yap
                        </button>
                    </div>
                ) : (
                    <div className={`flex flex-col items-center justify-center gap-5 w-2/5 max-xl:w-full`}>
                        <div
                            className="text-5xl max-sm:text-3xl mb-10 max-sm:mb-4 font-extralight"
                            style={{fontFamily: "Montserrat", userSelect: "none"}}>
                            Kayıt Ol
                        </div>
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="text-md max-sm:text-xs mb-2 flex"
                                 style={{fontFamily: "Montserrat", userSelect: "none"}}>
                                Zaten üye misiniz?
                                <div
                                    className="font-semibold text-purple-600 cursor-pointer hover:text-purple-500 ml-2 "
                                    style={{userSelect: "none"}}
                                    onClick={() => {
                                        setIsLogin(true)
                                    }}>
                                    Giriş Yap
                                </div>
                            </div>
                            <input
                                type="text"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                // ref={regUsernameRef}
                                placeholder="Kullanıcı Adı"
                                className="rounded-lg h-12 p-2 pl-4 w-full bg-[#F8F8F8] focus:border border-purple-600 text-[#2d2d2d] hover:bg-gray-100 focus:outline-0 focus:bg-gray-100"
                                style={{fontFamily: "Montserrat"}}/>
                        </div>

                        <input
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            // ref={regEmailRef}
                            placeholder="E-Posta"
                            className="rounded-lg h-12 p-2 pl-4 w-full bg-[#F8F8F8] focus:border border-purple-600 text-[#2d2d2d] hover:bg-gray-100 focus:outline-0 focus:bg-gray-100"
                            style={{fontFamily: "Montserrat"}}/>
                        <input
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            // ref={regPasswordRef}
                            placeholder="Parola"
                            className="rounded-lg h-12 p-2 pl-4 w-full bg-[#F8F8F8] focus:border border-purple-600 text-[#2d2d2d] hover:bg-gray-100 focus:outline-0 focus:bg-gray-100"
                            style={{fontFamily: "Montserrat"}}/>

                        {/*Hata mesajı*/}
                        <div className={"w-full"}>
                            <div className={`text-sm text-[#D61C4E]`}>{}</div>
                        </div>
                        {/*Hata mesajı bitişi*/}

                        <div className="flex w-full items-center">
                            <input type="checkbox"/>
                            <div
                                className="text-sm max-sm:text-xs max-sm:text-center ml-1 max-sm:ml-1"
                                style={{fontFamily: "Montserrat", userSelect: "none"}}>
                                Üyelik sözleşmesini kabul ediyoum.
                            </div>
                        </div>
                        <button
                            onClick={() => register(registerUsername, registerEmail, registerPassword)}
                            className="bg-purple-600 rounded-lg p-2 m-2 w-full text-xl text-white font-semibold hover:bg-purple-700"
                            style={{fontFamily: "Montserrat"}}>
                            Kayıt Ol
                        </button>
                    </div>
                )}

                {/*<LoginState/>*/}

            </div>
        </div>

    )
}
