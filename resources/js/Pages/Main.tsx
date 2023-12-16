import {
    BiSolidHomeAlt2,
    BiHomeAlt2,
    BiMessageDetail,
    BiSolidMessageDetail,
    BiSolidCircle,
    BiSolidPhone,
    BiPlusCircle,
    BiSolidSend,
    BiSolidUserPlus,
    BiKey,
    BiX, BiUserPlus, BiDotsVerticalRounded
} from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import {GrPersonalComputer} from "react-icons/gr";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContextProvider, useAuth} from "../Contexts/AuthContext";
import axios from "axios";

export default function Main() {
    const {logout} = useAuth();

    const [chatMessages, setChatMessages] = useState([]);


    const [currentScreen, setCurrentScreen] = useState("messages")

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    const [homeIconColor, setHomeIconColor] = useState("text-purple-700");
    const [messagesIconColor, setMessagesIconColor] = useState("text-gray-700")
    const [settingsIconColor, setSettingsIconColor] = useState("text-gray-700")

    function IconColorChanger(iconName: string) {
        if (iconName == "home"){
            setHomeIconColor("text-purple-700")
            setMessagesIconColor("text-gray-700")
            setSettingsIconColor("text-gray-700")
        }
        else if (iconName == "messages"){
            setHomeIconColor("text-gray-700")
            setMessagesIconColor("text-purple-700")
            setSettingsIconColor("text-gray-700")
        }
        else if (iconName == "settings"){
            setSettingsIconColor("text-purple-700")
        }
    }

    const [homeIcon, setHomeIcon] = useState("BiSolidHomeAlt2");
    const [messagesIcon, setMessagesIcon] = useState("BiMessageDetail")

    function HomeIcon() {
        if (homeIcon == "BiSolidHomeAlt2"){
            return (<BiSolidHomeAlt2/>)
        }
        else if (homeIcon == "BiHomeAlt2"){
            return (<BiHomeAlt2/>)
        }
    }

    function MessagesIcon() {
        if (messagesIcon == "BiMessageDetail"){
            return (<BiMessageDetail/>)
        }
        else if (messagesIcon == "BiSolidMessageDetail"){
            return (<BiSolidMessageDetail/>)
        }
    }

    function IconChanger(iconName: string) {
        if (iconName == "home"){
            setHomeIcon("BiSolidHomeAlt2")
            setMessagesIcon("BiMessageDetail")
        }
        else if (iconName == "messages"){
            setHomeIcon("BiHomeAlt2")
            setMessagesIcon("BiSolidMessageDetail")
        }
        else if (iconName == "settings"){
            setHomeIcon("BiHomeAlt2")
            setMessagesIcon("BiMessageDetail")
        }
    }

    return (
        <div className={"flex rounded-xl items-center justify-center p-4 h-screen bg-gradient-to-tr from-emerald-100 via-lime-100 to-teal-100"}>

            {/*Modal*/}
            <div
                className={`absolute bg-green-700 h-screen w-screen ${isSettingsOpen ? "block" : "hidden"} opacity-0`}
                onClick={() => {
                    setIsSettingsOpen(false);
                    setSettingsIconColor("text-gray-700");
                }}
            />

            <div className={`absolute flex w-[500px] h-[400px] ${isSettingsOpen ? "block" : "hidden"} bg-gray-100 rounded-xl left-[30px] bottom-[30px] z-20`}>

                {/*Sol Taraf*/}
                <div className={"flex flex-col w-2/6 gap-y-2 pt-2 bg-gray-200 rounded-l-xl"}>

                    {/*Her element*/}
                    <div className={"flex px-4 mx-1 rounded-md py-2 items-center gap-x-2 hover:bg-gray-100 transition duration-200 cursor-pointer"}>
                        <text className={"ml-2 text-xl"}><GrPersonalComputer/></text>
                        <text className={"ml-2 text-md"} style={{fontFamily: "Montserrat", userSelect: "none"}}>Genel</text>
                    </div>

                    <div className={"flex px-4 mx-1 rounded-md py-2 items-center gap-x-2 hover:bg-gray-100 transition duration-200 cursor-pointer"}>
                        <text className={"ml-2 text-xl"}><BiKey/></text>
                        <text className={"ml-2 text-md"} style={{fontFamily: "Montserrat", userSelect: "none"}}>Hesap</text>
                    </div>

                </div>

                {/*Sağ taraf*/}
                <div className={"w-4/6 flex flex-col p-4 justify-between"}>
                    <text className={"text-2xl font-semibold"}>Genel</text>

                    <div className={"flex flex-col gap-y-2"}>
                        <text className={"text-xl"}>Dil</text>
                        <select>
                            <option value="tr">Türkçe</option>
                            <option value="en">İngilizce</option>
                        </select>
                    </div>

                    <div className={"flex flex-col gap-y-2"}>
                        <text className={"text-xl"}>Yazı Tipi</text>
                        <select>
                            <option value="montserrat">Montserrat</option>
                            <option value="comicSans">Comic Sans</option>
                            <option value="timesNewRoman">Times New Roman</option>
                        </select>
                    </div>

                    <div className={"flex flex-col gap-y-2"}>
                        <button
                            className={"w-24 px-4 py-2 rounded-md bg-[#D61C4E] hover:bg-[#b81843] text-white font-bold transition duration-200"}
                            onClick={() => {logout()}}
                        >Çıkış</button>
                    </div>

                </div>

                <div
                    className={"h-8 w-8 m-1 flex items-center justify-center cursor-pointer text-xl"}
                    onClick={() => {
                        setIsSettingsOpen(!isSettingsOpen);
                        setSettingsIconColor("text-gray-700");
                    }}
                >
                    <BiX/>
                </div>
            </div>
            {/*Modal bitiş*/}


            {/*Sol*/}
            <div className={" h-full bg-white p-4 border-r rounded-l-xl"}>
                <div className={"flex flex-col h-full justify-between items-center"}>

                    <div>
                        <div>
                            {/*pp*/}
                            <div
                                className={"w-14 h-14 mb-8 rounded-2xl bg-purple-700 flex items-center justify-center text-xl text-white cursor-pointer"}
                                style={{fontFamily: "Montserrat"}}
                                onClick={() => {setCurrentScreen("profile")}}
                            >A</div>
                            {/*pp bitiş*/}

                            <div className={"flex flex-col gap-y-4 text-2xl"}>
                                {/*Home*/}
                                <div className={`h-14 flex items-center justify-center ${homeIconColor} rounded-xl hover:bg-gray-100 transition duration-300 cursor-pointer`}
                                     onClick={() => {IconColorChanger("home"); IconChanger("home"); setCurrentScreen("home")}}
                                >
                                    <HomeIcon/>
                                </div>
                                {/*Messages*/}
                                <div className={`h-14 flex items-center justify-center ${messagesIconColor} rounded-xl hover:bg-gray-100 transition duration-300 cursor-pointer`}
                                     onClick={() => {IconColorChanger("messages"); IconChanger("messages"); setCurrentScreen("messages")}}
                                >
                                    <MessagesIcon/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            {/*Settings*/}
                            <div className={`h-14 w-14 flex items-center justify-center text-2xl ${settingsIconColor} rounded-xl hover:bg-gray-100 transition duration-300 cursor-pointer`}
                                 onClick={() => {IconColorChanger("settings"); IconChanger("settings"); setIsSettingsOpen(!isSettingsOpen)}}
                            >
                                <IoMdSettings/>
                            </div>
                            {/*Settings bitiş*/}
                        </div>
                    </div>
                </div>
            </div>
            {/*Sol bitiş*/}

            {currentScreen === "home" ? (
                <div className={"w-full h-full flex flex-col bg-white items-center justify-center rounded-r-xl"}>
                    <div className={"text-7xl"}><BiSolidUserPlus/></div>
                    <div className={"flex flex-col items-center justify-center"}>
                        <text className={"text-3xl text-gray-700 font-semibold"} style={{fontFamily: "Montserrat"}}>Yeni bir sohbet başlatmak için</text>
                        <text className={"text-3xl text-gray-700 font-semibold"} style={{fontFamily: "Montserrat"}}>soldan mesajlar sekmesine tıklayın</text>
                    </div>
                </div>
                ) : currentScreen === "messages" ? (
                <div className={"w-full h-full flex rounded-r-xl"}>
                    <div className={"w-[30%] flex flex-col bg-white border-r"}>

                        {/*Header*/}
                        <div className={"h-[10%] border-b px-6 flex items-center"}>
                            <text className={"text-gray-900 text-2xl font-semibold"} style={{fontFamily: "Montserrat"}}>Mesajlar</text>
                        </div>
                        {/*Header bitiş*/}

                        {/*Body*/}
                        <div className={"h-[90%] px-6 flex flex-col mt-4"}>
                            <div>
                                <input
                                    type="search"
                                    placeholder={"Arama"}
                                    className={"w-full h-12 p-2 pl-4 bg-gray-200 rounded-xl focus:outline-0 focus:bg-gray-100 hover:bg-gray-100 transition duration-200"}
                                    style={{fontFamily: "Montserrat"}}
                                />

                            </div>

                            {/*Kişiler*/}
                            <div className={"mt-8 mb-8 pr-2 overflow-auto"}>

                                <div className={""}>
                                    {/*Kişi Kartı*/}
                                    <div className={"flex items-center justify-between gap-x-4 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-200"}>
                                        <div className={"w-14 h-12 rounded-md bg-purple-700 flex items-center justify-center text-xl text-white cursor-pointer"} style={{fontFamily: "Montserrat"}}>A</div>

                                        <div className={"flex flex-col w-full gap-y-2"}>
                                            <div className={"flex justify-between items-center"}>
                                                <text className={"text-md font-semibold"} style={{fontFamily: "Montserrat"}}>Ahmet Hakan Cansız</text>
                                                <text className={"text-xl text-gray-500 cursor-pointer rounded-full hover:bg-gray-300 transition duration-200"} style={{fontFamily: "Montserrat"}}><BiDotsVerticalRounded /></text>
                                            </div>
                                            <div className={"flex justify-between items-center"}>
                                                <text className={"text-sm text-gray-500"} style={{fontFamily: "Montserrat"}}>Merhaba</text>
                                                <text className={"text-sm text-gray-500"} style={{fontFamily: "Montserrat"}}>12m</text>
                                            </div>
                                        </div>
                                    </div>

                                    {/*Kişi Kartı Sonu*/}

                                    <div className={"flex items-center justify-between gap-x-4 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-200"}>
                                        <div className={"w-14 h-12 rounded-md bg-purple-700 flex items-center justify-center text-xl text-white cursor-pointer"} style={{fontFamily: "Montserrat"}}>G</div>

                                        <div className={"flex flex-col w-full"}>
                                            <div className={"flex justify-between items-center"}>
                                                <text className={"text-md font-semibold"} style={{fontFamily: "Montserrat"}}>Grup 1</text>
                                                <text className={"text-sm text-gray-500"} style={{fontFamily: "Montserrat"}}>1h</text>
                                            </div>
                                            <text className={"text-sm text-gray-500"} style={{fontFamily: "Montserrat"}}>Hakan: Hoşgeldiniz</text>
                                        </div>
                                    </div>

                                {/*    burası*/}



                                {/*    burası son*/}

                                </div>

                            </div>
                        </div>
                        {/*Body bitiş*/}

                    </div>

                    <div className={"w-[70%] bg-white flex flex-col"}>

                        {/*Header*/}
                        <div className={"h-[10%] border-b px-6 flex items-center justify-between"}>
                            <div className={"flex flex-col"}>
                                <text className={"text-gray-900 text-2xl font-semibold"} style={{fontFamily: "Montserrat", userSelect: "none"}}>Ahmet Hakan Cansız</text>
                                <div className={"text-sm text-green-500 flex items-center gap-2"}><BiSolidCircle/>Çevrimiçi</div>
                            </div>

                            <div>
                                <div className={"flex p-4 items-center justify-center gap-2 bg-purple-200 rounded-md cursor-pointer transition duration-200 hover:bg-purple-300"}>
                                    <text className={"text-md text-purple-800"}><BiSolidPhone/></text>
                                </div>
                            </div>
                        </div>
                        {/*Header bitiş*/}

                        {/*Body*/}
                        <div className={"flex flex-col h-full justify-between"}>
                            <div className={"overflow-y-scroll h-full"}>

                                {/*Her mesaj için*/}
                                <div className={"flex justify-end mt-4 mr-2"}>
                                    <div className={"bg-purple-700 rounded-tl-lg rounded-br-lg rounded-bl-lg p-4 text-white text-sm"} style={{fontFamily: "Montserrat"}}>
                                        Merhaba
                                    </div>
                                </div>
                                {/*Her mesaj*/}

                                <div className={"flex justify-start mt-4 ml-2"}>
                                    <div className={"bg-gray-200 rounded-tr-lg rounded-br-lg rounded-bl-lg p-4 text-sm"} style={{fontFamily: "Montserrat"}}>
                                        Merhaba
                                    </div>
                                </div>

                            </div>

                            <div>
                                {/*Mesaj yazma alanı*/}
                                <div className={"flex items-center justify-between gap-x-2 px-2 py-4"}>
                                    <div className={"text-2xl text-purple-800 rounded cursor-pointer hover:bg-purple-200 p-2 transition duration-200"}><BiPlusCircle/></div>
                                    <input
                                        type="text"
                                        placeholder={"Mesaj yaz"}
                                        className={"w-full h-12 p-2 pl-4 bg-gray-200 rounded-xl focus:outline-0 focus:bg-gray-100 hover:bg-gray-100 transition duration-200"}
                                        style={{fontFamily: "Montserrat"}}
                                    />
                                    <div className={"flex items-center justify-center gap-x-2"}>
                                        <div className={"bg-purple-700 rounded-full p-2 text-white text-xl cursor-pointer"} style={{fontFamily: "Montserrat"}}><BiSolidSend/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Body bitiş*/}

                    </div>
                </div>
                ) : (
                    <div className={"w-full h-full flex flex-col bg-white items-center rounded-r-xl"}>
                        <div className={"flex flex-col items-center justify-center gap-y-4 mt-24 w-full"}>
                            <div className={"w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center text-4xl text-white"} style={{fontFamily: "Montserrat", userSelect: "none"}}>A</div>
                            <text className={"text-3xl text-gray-700 font-semibold"} style={{fontFamily: "Montserrat"}}>Ahmet Hakan Cansız</text>

                            <div className={"flex justify-between w-[90%] mt-12 gap-x-14 bg-gray-300"}>

                                <div> {/*Alan*/}

                                    <div> {/*Çerçeve*/}

                                        <div> {/*Header Alanı*/}
                                            <div> {/*Header*/}
                                            {/*    friendships header*/}

                                            </div>
                                        </div>

                                        <div>{/*Body Alanı*/}
                                            <div> {/*Body*/}
                                                <div>{/*Element alanı*/}
                                                    <div>{/*Element*/}
                                                        element
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div>
                                    2
                                </div>

                                <div>
                                    3
                                </div>

                            </div>

                        </div>
                    </div>
                )
            }

        </div>
    )
}
