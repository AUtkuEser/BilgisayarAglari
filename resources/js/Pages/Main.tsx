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
    BiX, BiUserPlus, BiDotsVerticalRounded, BiSearch, BiSolidCheckCircle, BiArrowBack
} from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import {GrPersonalComputer} from "react-icons/gr";
import React, {useEffect, useState} from "react";
import {AuthContextProvider, useAuth} from "../Contexts/AuthContext";
import axios from "axios";
import Pusher from "pusher-js";
import {IChatRoom, IChatRoomBox, IChatRoomUser, IMessage, IUser} from "../index";
import {decryptString, encryptString, makeKey} from "../../utils/encryption";
import {flatten} from "pusher-js/types/src/core/utils/collections";
import {RiChatNewLine} from "react-icons/ri";
import {LuMessageSquarePlus} from "react-icons/lu";


function Message({message, user1token, user2token, user1Id, user2Id}: {message: IMessage, user1token: string, user2token: string, user1Id: number, user2Id: number}) {
    const [tempData, setTempData] = useState(message.message);
    const {user} = useAuth();

    useEffect(() => {
        setTempData(decryptString(message.message, makeKey(user1token, user2token, user1Id, user2Id)));
    }, []);

    if (user?.data?.data?.id === message?.user_id) {
        return (
            <div className={"flex justify-end mt-4 mr-2"}>
                <div
                    className={"bg-purple-700 rounded-tl-lg whitespace-break-spaces overflow-ellipsis rounded-br-lg rounded-bl-lg gap-x-4 py-4 pl-4 pr-3 min-w-[100px] max-w-[600px] max-lg:max-w-[300px] text-white text-md max-md:text-sm justify-between items-center flex"}
                    style={{fontFamily: "Montserrat"}}>
                    {tempData}
                    <div className={"h-full flex items-end select-none text-gray-200"} style={{fontSize: 9}}>
                        {new Date(message.created_at).toLocaleTimeString("tr-TR", {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={"flex justify-start mt-4 ml-2"}>
            <div
                className={"bg-gray-200 rounded-tr-lg rounded-br-lg rounded-bl-lg p-4 gap-x-4 py-4 pl-4 pr-3 min-w-[100px] max-w-[600px] max-lg:max-w-[300px] text-md max-md:text-sm justify-between items-center flex"}
                style={{fontFamily: "Montserrat"}}>
                {tempData}
                <div className={"flex h-full items-end select-none text-gray-600"} style={{fontSize: 9}}>
                    {new Date(message.created_at).toLocaleTimeString("tr-TR", {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>
        </div>
    )
}


export default function Main() {
    const {logout, user} = useAuth();

    const [allChats, setAllChats] = useState<IChatRoom[]>([]);
    const [lastMessages, setLastMessages] = useState<IMessage[]>([]);
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number>();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [message, setMessage] = useState('');

    const [pusherMessages, setPusherMessages] = useState<IMessage[]>([]);
    const [pusherMessage, setPusherMessage] = useState('');

    const [target, setTarget] = useState<IUser[]>([]);

    const [currentScreen, setCurrentScreen] = useState("messages")

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    const [isAddChatRoomModalOpen, setIsAddChatRoomModalOpen] = useState(false);
    const [addChatRoomName, setAddChatRoomName] = useState("");
    const [addChatRoomUsername, setAddChatRoomUsername] = useState("");
    const [addChatSearchResults, setAddChatSearchResults] = useState<IUser[]>([]);
    const [addChatSelectedUsers, setAddChatSelectedUsers] = useState<IUser[]>([]);

    const [smallState, setSmallState] = useState("chats");

    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, pusherMessages]);

    useEffect(() => {
        const isFirstVisit = localStorage.getItem('firstVisit');

        if (!isFirstVisit) {
            window.location.reload();
            localStorage.setItem('firstVisit', 'true');
        }
    }, []);

    useEffect(() => {
        loadAllChats();
    }, []);

    useEffect(() => {
        if (currentChatRoomId) {
            Pusher.logToConsole = true;
            const pusher = new Pusher('4606dfb4107034ccd68e', {
                cluster: 'eu'
            });

            const updatePusherChannel = (chatRoomId: React.SetStateAction<number | undefined>) => {
                if (currentChatRoomId && chatRoomId !== currentChatRoomId) {
                    const oldChannel = pusher.subscribe(`chat-room.${currentChatRoomId}`);
                    oldChannel.unbind('message');
                    oldChannel.unsubscribe();
                }

                setCurrentChatRoomId(chatRoomId);
                const channel = pusher.subscribe(`chat-room.${chatRoomId}`);
                channel.bind('message', function(data: IMessage) {
                    setPusherMessages(prevMessages => [...prevMessages, data]);
                });
            };

            updatePusherChannel(currentChatRoomId);
        }
    }, [currentChatRoomId]);

    useEffect(() => {
        if (currentChatRoomId) {
            axios.get(`/api/chats2/${currentChatRoomId}`).then((response) => {
                setMessages(response?.data.data.chatRoomMessages);
                setTarget(response?.data.data.target);
            });
        }
    }, [currentChatRoomId]);

    const loadAllChats = async () => {
        const {data} = await axios.get('/api/chats');
        setAllChats(data.data.chatRooms);
        setLastMessages(data.data.lastMessage);
    }

    const targetUser = target?.at(0) ?? user;

    const sendMessage = () => {
        const userToken = user.data.data.token
        const userId = user.data.data.id

        if (message.length > 0) {
            axios.post('/api/messages', {
                chat_room_id : currentChatRoomId,
                user_id : userId,
                message : pusherMessage,
            }).then((response) => {
                setPusherMessage('');
                setMessage('');
            })

            axios.post('/api/message', {
                chat_room_id : currentChatRoomId,
                user_id : userId,
                message : target.length < 2 ? encryptString(message, makeKey(userToken, targetUser.token, userId, targetUser.id)) : message,
            }).then((response) => {
                setMessage('');
            })
        }
    }

    const searchUsers = async (username: string) => {
        try {
            if (addChatRoomUsername !== "") {
                const { data } = await axios.get(`/api/search/${username}`);
                setAddChatSearchResults(data.data);
            }
            else {
                setAddChatSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }

    const addChatRoom = async () => {
        try {
            console.log(addChatSelectedUsers.map((user) => user.id))
            const { data } = await axios.post('/api/addChat', {
                name: addChatRoomName,
                users: addChatSelectedUsers.map((user) => user.id),
            });

            setAllChats(prevChats => [...prevChats, data.data]);
            setAddChatRoomName("");
            setAddChatRoomUsername("");
            setAddChatSearchResults([]);
            setAddChatSelectedUsers([]);
            setIsAddChatRoomModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    }

    return (
        <div className={"flex items-center justify-center p-8 max-lg:p-4 max-md:p-2 max-sm:p-0 h-screen bg-gradient-to-tr from-purple-200 to-purple-400"}>

            {/*Modal*/}
            <div
                className={`absolute h-screen w-screen ${isSettingsOpen || isAddChatRoomModalOpen ? "block" : "hidden"} opacity-0`}
                onClick={() => {
                    setIsSettingsOpen(false);
                    setIsAddChatRoomModalOpen(false);
                }}
            />

            <div className={`absolute flex w-[500px] h-[400px] ${isSettingsOpen ? "block" : "hidden"} bg-gray-100 rounded-xl left-[80px] bottom-[80px] max-sm:left-4 max-sm:bottom-4 max-sm:w-[400px] z-20`}>

                {/*Sol Taraf*/}
                <div className={"flex flex-col w-2/6 gap-y-2 pt-2 bg-gray-200 rounded-l-xl"}>

                    {/*Her element*/}
                    <div className={"flex px-4 mx-1 rounded-md py-2 items-center gap-x-2 hover:bg-gray-100 transition duration-200 cursor-pointer"}>
                        <div className={"ml-2 text-xl"}><GrPersonalComputer/></div>
                        <div className={"ml-2 text-md"} style={{fontFamily: "Montserrat", userSelect: "none"}}>Genel</div>
                    </div>

                    <div className={"flex px-4 mx-1 rounded-md py-2 items-center gap-x-2 hover:bg-gray-100 transition duration-200 cursor-pointer"}>
                        <div className={"ml-2 text-xl"}><BiKey/></div>
                        <div className={"ml-2 text-md"} style={{fontFamily: "Montserrat", userSelect: "none"}}>Hesap</div>
                    </div>

                </div>

                {/*Sağ taraf*/}
                <div className={"w-4/6 flex flex-col p-4 justify-between"}>
                    <div className={"text-2xl font-semibold"}>Genel</div>

                    <div className={"flex flex-col gap-y-2"}>
                        <div className={"text-xl"}>Dil</div>
                        <select>
                            <option value="tr">Türkçe</option>
                            <option value="en">İngilizce</option>
                        </select>
                    </div>

                    <div className={"flex flex-col gap-y-2"}>
                        <div className={"text-xl"}>Yazı Tipi</div>
                        <select>
                            <option value="montserrat">Montserrat</option>
                            <option value="comicSans">Comic Sans</option>
                            <option value="timesNewRoman">Times New Roman</option>
                        </select>
                    </div>

                    <div className={"flex flex-col gap-y-2"}>
                        <button
                            className={"w-24 px-4 py-2 rounded-md bg-[#D61C4E] hover:bg-[#b81843] text-white font-bold transition duration-200"}
                            onClick={() => {logout(); localStorage.removeItem('firstVisit');}}
                        >Çıkış</button>
                    </div>

                </div>

                <div
                    className={"h-8 w-8 m-1 flex items-center justify-center cursor-pointer text-xl"}
                    onClick={() => {
                        setIsSettingsOpen(!isSettingsOpen);
                    }}>
                    <BiX/>
                </div>
            </div>
            {/*Modal bitiş*/}


            {/*Sol*/}
            <div className={`h-full bg-white p-4 max-xl:px-2 max-lg:px-0 max-sm:px-2 border-r rounded-l-xl max-sm:rounded-none ${smallState === "chats" ? "max-sm:block" : "max-sm:hidden"}`}>
                <div className={"flex flex-col h-full justify-between items-center"}>

                    <div>
                        {/*pp*/}
                        <div
                            className={"w-14 max-xl:w-12 max-lg:w-10 h-14 max-xl:h-12 max-lg:h-10 max-sm:w-[48px] max-sm:h-[48px] mb-8 rounded-2xl max-xl:rounded-xl flex items-center justify-center cursor-pointer"}
                            style={{fontFamily: "Montserrat"}}
                            onClick={() => {setCurrentScreen("profile")}}>
                            <img
                                src={user?.data?.data?.avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png"}
                                alt={user?.data?.data?.id}
                                className={"w-14 max-xl:w-12 max-lg:w-10 h-14 max-xl:h-12 rounded-2xl max-sm:rounded-xl max-sm:w-full"}
                            />
                        </div>
                        {/*pp bitiş*/}

                        <div className={"flex flex-col gap-y-4 max-lg:gap-y-2 text-2xl max-lg:text-xl"}>
                            {/*Messages*/}
                            <div
                                className={`h-14 max-lg:h-10 flex items-center justify-center ${currentScreen === "messages" ? "text-purple-800" : "text-gray-600"} rounded-xl hover:bg-gray-100 transition duration-300 cursor-pointer`}
                                onClick={() => {
                                    setCurrentScreen("messages")
                                }}
                            >
                                {currentScreen === "messages" ? (
                                    <BiSolidMessageDetail/>
                                ) : (
                                    <BiMessageDetail/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        {/*Settings*/}
                        <div
                            className={`h-14 w-14 flex items-center justify-center text-2xl max-lg:text-xl text-purple-800 rounded-xl hover:bg-gray-100 transition duration-300 cursor-pointer`}
                            onClick={() => {
                                setIsSettingsOpen(!isSettingsOpen);
                                setIsAddChatRoomModalOpen(false)
                            }}
                        >
                            <IoMdSettings/>
                        </div>
                        {/*Settings bitiş*/}
                    </div>
                </div>
            </div>
            {/*Sol bitiş*/}

            {currentScreen === "messages" ? (
                <div className={"w-full h-full flex rounded-r-xl max-sm:rounded-none"}>
                    <div className={`w-[30%] flex flex-col bg-white border-r ${smallState === "chats" ? "max-sm:flex max-sm:w-full" : "max-sm:hidden"}`}>

                        {/*Header*/}
                        <div className={"h-[10%] border-b px-6 flex items-center justify-between relative"}>
                            <div className={"text-gray-900 text-2xl font-semibold select-none"} style={{fontFamily: "Montserrat"}}>Mesajlar</div>
                            <div
                                className={"text-2xl text-gray-800 h-12 w-12 flex items-center justify-center select-none rounded-xl cursor-pointer hover:bg-gray-100 transition duration-300"}
                                onClick={() => {setIsAddChatRoomModalOpen(!isAddChatRoomModalOpen); setIsSettingsOpen(false)}}
                            >
                                <LuMessageSquarePlus />
                            </div>

                            {/* Chat Ekleme Modalı */}
                            <div className={`${isAddChatRoomModalOpen? "block" : "hidden"} absolute top-16 left-[120px] max-sm:-left-12`} style={{fontFamily: "Montserrat"}}>
                                <div className={"w-96 h-[560px] bg-gray-100 p-4 flex flex-col items-center gap-y-10 rounded-lg border border-gray-200"}>
                                    <div className={"text-gray-900 text-lg font-thin select-none"} style={{fontFamily: "Montserrat"}}>Yeni Bir Sohbet Oluştur</div>
                                    <div className={"gap-y-4 flex flex-col"}>
                                        <div className={"flex flex-col items-center justify-center"}>
                                            <input
                                                type="text"
                                                placeholder={"Sohbet Adı"}
                                                value={addChatRoomName}
                                                onChange={(e) => {setAddChatRoomName(e.target.value)}}
                                                className={"w-full h-12 p-2 pl-4 bg-gray-50 select-none rounded-xl border border-purple-800 focus:outline-0 hover:bg-white focus:bg-white transition duration-200"}
                                                style={{fontFamily: "Montserrat"}}
                                            />
                                        </div>
                                        <div className={""}>
                                            <div className={"flex items-center justify-end"}>
                                                <input
                                                    type="text"
                                                    placeholder={"Kullanıcı Adı"}
                                                    value={addChatRoomUsername}
                                                    onChange={(e) => {
                                                        setAddChatRoomUsername(e.target.value)
                                                        searchUsers(addChatRoomUsername)
                                                    }}
                                                    className={`w-full h-12 p-2 pl-4 bg-gray-50 select-none ${addChatSearchResults?.length > 0 && addChatRoomUsername.length > 1 ? "rounded-t-xl" : "rounded-xl"} border border-purple-800 focus:outline-0 hover:bg-white focus:bg-white transition duration-200`}
                                                    style={{fontFamily: "Montserrat"}}
                                                />
                                            </div>

                                            <div className={`w-full gap-y-3 flex flex-col select-none ${addChatSearchResults?.length > 0 && addChatRoomUsername.length > 1 ? "flex" : "hidden"}`}>
                                                <div className={"w-full max-h-44 bg-white overflow-auto"}>
                                                    <div className={"flex flex-col gap-y-2"}>
                                                        {addChatSearchResults.filter((resultUser) => resultUser.id !== user.data.data.id).map((resultUser, index) => (
                                                                <div
                                                                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-purple-100 ${addChatSelectedUsers.includes(resultUser) ? "bg-purple-100" : "bg-white"} transition duration-200`}
                                                                    key={index}
                                                                    onClick={() => {
                                                                        if (!addChatSelectedUsers.includes(resultUser)) {
                                                                            if (!addChatSelectedUsers.includes(user.data.data)) {
                                                                                setAddChatSelectedUsers(prevUsers => [...prevUsers, user.data.data, resultUser]);
                                                                            } else {
                                                                                setAddChatSelectedUsers(prevUsers => [...prevUsers, resultUser]);
                                                                            }
                                                                        } else {
                                                                            setAddChatSelectedUsers(prevUsers => prevUsers.filter((prevUser) => prevUser.id !== resultUser.id));
                                                                        }
                                                                    }}>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        <img
                                                                            className={"h-10 w-10 rounded-full flex items-center justify-center object-cover"}
                                                                            src={resultUser.avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png"}
                                                                            alt={"pp" + resultUser.id}
                                                                        >
                                                                        </img>
                                                                        <div>
                                                                            {/*<div className={"text-xs font-semibold"}>*/}
                                                                            {/*    {resultUser.name}*/}
                                                                            {/*</div>*/}
                                                                            <div className={"text-xs text-gray-600"}>
                                                                                {resultUser.username}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={addChatSelectedUsers.includes(resultUser) ? "text-purple-800" : "text-gray-600"}>
                                                                        <BiSolidCheckCircle/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={"gap-y-2 flex flex-col select-none"}>
                                                <div
                                                    className={`${addChatSelectedUsers.length > 1 && addChatRoomName.length > 0 ? "flex" : "hidden"} mt-3 bg-purple-700 flex items-center justify-center py-1.5 rounded-lg text-white hover:bg-purple-800 transition duration-300 cursor-pointer`}
                                                    onClick={() => {
                                                        if (addChatRoomName.length > 0) {
                                                            addChatRoom();
                                                        }
                                                    }}
                                                >
                                                    Oluştur
                                                </div>
                                                <div>Seçilenler:</div>
                                                <div
                                                    className={`flex flex-wrap max-w-[230px] ${addChatRoomUsername.length > 1 ? "max-h-[100px]" : "max-h-[200px]"} overflow-auto gap-2`}>
                                                    {addChatSelectedUsers.map((selectedUser, index) => (
                                                        <div
                                                            key={index}
                                                            className={"text-xs font-semibold text-white bg-purple-700 flex items-center justify-between rounded-full gap-2 px-3 py-2 cursor-pointer hover:bg-purple-800 transition duration-200"}
                                                            onClick={() => {
                                                                if (selectedUser.id !== user.data.data.id) {
                                                                    setAddChatSelectedUsers(prevUsers => prevUsers.filter((prevUser) => prevUser.id !== selectedUser.id));
                                                                }
                                                            }}
                                                        >
                                                            <div>
                                                                {selectedUser.id === user.data.data.id ? "Siz" : selectedUser.username}
                                                            </div>
                                                            <div className={"text-lg"}>
                                                                <BiX/>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Chat Ekleme Modalı */}
                        </div>
                        {/*Header bitiş*/}

                        {/*Body*/}
                        <div className={"h-[90%] px-6 flex flex-col mt-4"}>
                        {/*Kişiler*/}
                            <div className={"pr-2 overflow-auto"}>
                                <div className={""}>
                                    {/*Kişi Kartı*/}

                                    {allChats.map((chat, index) => {
                                        const lastMessage = lastMessages.find((message) => message?.chat_room_id === chat.id);

                                        const createdAt = lastMessage?.created_at ? new Date(lastMessage?.created_at) : null;
                                        const timeString = createdAt?.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        });

                                        return (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    if (chat.id != currentChatRoomId) {
                                                        setMessages([]);
                                                        setPusherMessages([]);
                                                        setCurrentChatRoomId(chat.id);
                                                        setSmallState("messages");
                                                    }
                                                }}
                                                className={`flex items-center gap-x-4 p-4 max-xl:p-2 mb-2 rounded-xl cursor-pointer hover:bg-gray-100 ${currentChatRoomId === chat.id ? "bg-gray-100" : ""} transition duration-200`}>

                                                <div className={"w-[48px] h-[48px] flex items-center justify-center"}>
                                                    <div className={"h-full w-full"}>
                                                        {chat.users?.length > 2 ? (
                                                            <img
                                                                src={chat.photo_url? "" : "https://i.im.ge/2024/01/04/3XfxmM.group.md.png"}
                                                                alt={"chat-" + chat.id}
                                                                className={"h-full w-full object-cover rounded-full"}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={chat.users.filter(value => value.id !== user?.data?.data?.id)[0].avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png"}
                                                                alt=""
                                                                className={"h-full w-full object-cover rounded-full"}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={"flex flex-col gap-y-2 text-pretty"}>
                                                    <div className={"flex justify-between items-center"}>
                                                        <div className={"text-md max-lg:text-sm max-md:text-xs max-sm:text-lg font-semibold"} style={{ fontFamily: "Montserrat" }}>
                                                            {chat.users?.length > 2 ? chat.name : chat.users?.find((chatUser) => chatUser.id !== user?.data?.data?.id)?.username}
                                                        </div>
                                                    </div>
                                                    <div className={"flex justify-between items-center"}>
                                                        <div className={"text-sm max-lg:text-xs max-sm:text-md text-gray-500"} style={{ fontFamily: "Montserrat" }}>
                                                            {lastMessage?.created_at ? (
                                                                new Date(lastMessage?.created_at).toLocaleDateString("tr-TR", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                })
                                                            ) : (
                                                                new Date().toLocaleDateString("tr-TR", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}

                                    {/*Kişi Kartı Sonu*/}
                                </div>
                            </div>
                        </div>
                        {/*Body bitiş*/}

                    </div>

                    <div className={`w-[70%] bg-white flex flex-col rounded-r-xl ${smallState === "chats" ? "max-sm:hidden" : "max-sm:flex max-sm:w-full"}`}>

                        {/*Header*/}
                        <div className={"h-[10%] border-b px-3 flex items-center justify-between"}>
                            <div
                                className={"flex items-center text-gray-900 text-2xl max-md:text-sm font-semibold gap-x-4"}
                                style={{fontFamily: "Montserrat", userSelect: "none"}}>
                                <div
                                    className={"text-2xl p-0.5 cursor-pointer hidden max-sm:block"}
                                    onClick={() => {
                                        setSmallState("chats")
                                    }}
                                >
                                    <BiArrowBack/>
                                </div>
                                <div className={"h-14 w-14 flex items-center"}>
                                    {target.length > 1 ? (
                                        <img
                                            src={allChats?.filter(filterChat => filterChat?.id === currentChatRoomId)[0]?.photo_url ?? "https://i.im.ge/2024/01/04/3XfxmM.group.md.png"}
                                            alt=""
                                            className={"h-full w-full object-cover rounded-full"}
                                        />
                                    ) : (
                                        <img src={targetUser?.avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png"}
                                             alt=""
                                             className={"h-full w-full object-cover rounded-full"}
                                        />
                                    )}
                                </div>
                                <div className={"flex flex-col"}>
                                    {
                                        target.length > 1 ? (
                                            allChats.find((chat) => chat.id === currentChatRoomId)?.name
                                        ) : (
                                            targetUser?.username
                                        )
                                    }
                                    <div className={"text-xs text-gray-400"}>
                                        {"Siz, "}
                                        {
                                            target.map((userG, index) => (
                                                <span key={index}>
                                                        {userG.username}
                                                    {index !== target.length - 1 ? ", " : ""}
                                                    </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div
                                    className={`flex p-4 ${targetUser?.username ? "flex" : "hidden"} items-center justify-center gap-2 bg-purple-200 rounded-md cursor-pointer transition duration-200 hover:bg-purple-300`}>
                                    <div className={"text-md text-purple-800"}><BiSolidPhone/></div>
                                </div>
                            </div>
                        </div>
                        {/*Header bitiş*/}

                        {/*Body*/}
                        <div className={"flex flex-col h-[90%] justify-between"}>
                            <div className={"overflow-auto"}>
                                {/*Her mesaj için*/}
                                {messages.length > 0 && currentChatRoomId && messages.map((message, index) => {
                                    const user1token = user?.data?.data?.token ?? "";
                                    const user1Id = user?.data?.data?.id ?? 0;
                                    const senderAvatar = target.find((user) => user.id === message.user_id)?.avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png";
                                    const senderName = target.find((user) => user.id === message.user_id)?.username ?? "";
                                    const isGroup = target.length > 1;

                                    if (target.length > 1) {
                                        if (message.user_id === user1Id) {
                                            return (
                                                <div key={index} className={"flex justify-end mt-4 mr-2"}>
                                                    <div
                                                        className={"bg-purple-700 rounded-tl-lg rounded-br-lg rounded-bl-lg gap-x-4 py-4 pl-4 pr-3 min-w-[100px] max-w-[600px] max-lg:max-w-[300px] text-white text-md justify-between items-center flex"}
                                                        style={{fontFamily: "Montserrat"}}>
                                                        {message?.message}
                                                        <div
                                                            className={"h-full flex items-end select-none text-gray-200"}
                                                            style={{fontSize: 9}}>
                                                            {message?.created_at ? (
                                                                new Date(message.created_at).toLocaleTimeString("tr-TR", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            ) : (
                                                                new Date().toLocaleTimeString("tr-TR", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={index} className={"flex justify-start mt-4 ml-2"}>
                                                    <div className={`w-12 h-12 mr-2 ${isGroup? "block" : "hidden"}`}>
                                                        <img
                                                            src={senderAvatar}
                                                            alt={"pp" + message.user_id}
                                                            className={"w-12 h-12 rounded-full"}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm select-none ${isGroup? "block" : "hidden"}`} style={{fontFamily: "Montserrat"}}>
                                                            {senderName}
                                                        </div>
                                                        <div
                                                            className={"bg-gray-200 rounded-tr-lg rounded-br-lg rounded-bl-lg p-4 gap-x-4 py-4 pl-4 pr-3 min-w-[100px] max-w-[600px] max-lg:max-w-[300px] text-md justify-between items-center flex"}
                                                            style={{fontFamily: "Montserrat"}}>
                                                            {message?.message}
                                                            <div
                                                                className={"flex h-full items-end select-none text-gray-600"}
                                                                style={{fontSize: 9}}>
                                                                {message?.created_at ? (
                                                                    new Date(message.created_at).toLocaleTimeString("tr-TR", {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })
                                                                ) : (
                                                                    new Date().toLocaleTimeString("tr-TR", {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    } else {
                                        return (
                                            <Message
                                                key={index}
                                                message={message}
                                                user1token={user1token}
                                                user2token={targetUser.token}
                                                user1Id={user1Id}
                                                user2Id={targetUser.id}
                                            />
                                        );
                                    }
                                })}
                                {pusherMessages.map((message, index) => {
                                    const user1Id = user.data.data.id;
                                    const senderAvatar = target.find((user) => user.id === message.message.user_id)?.avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png";
                                    const senderName = target.find((user) => user.id === message.message.user_id)?.username ?? "";
                                    const isGroup = target.length > 1;

                                    if (message.message.user_id === user1Id) {
                                        return (
                                            <div key={index} className={"flex justify-end mt-4 mr-2"}>
                                                <div
                                                    className={"bg-purple-700 rounded-tl-lg rounded-br-lg rounded-bl-lg gap-x-4 py-4 pl-4 pr-3 min-w-[100px] max-w-[600px] max-lg:max-w-[300px] text-white text-md justify-between items-center flex"}
                                                    style={{fontFamily: "Montserrat"}}>
                                                    {message?.message.message}
                                                    <div className={"h-full flex items-end select-none text-gray-200"}
                                                         style={{fontSize: 9}}>
                                                        {message?.created_at ? (
                                                            new Date(message.created_at).toLocaleTimeString("tr-TR", {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })
                                                        ) : (
                                                            new Date().toLocaleTimeString("tr-TR", {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index} className={"flex justify-start mt-4 ml-2"}>
                                                <div className={`w-12 h-12 mr-2 ${isGroup? "block" : "hidden"}`}>
                                                    <img
                                                        src={senderAvatar}
                                                        alt={"pp" + message.user_id}
                                                        className={"w-12 h-12 rounded-full"}
                                                    />
                                                </div>
                                                <div>
                                                    <div className={`text-sm select-none ${isGroup? "block" : "hidden"}`}
                                                         style={{fontFamily: "Montserrat"}}>{senderName}
                                                    </div>
                                                    <div
                                                        className={"bg-gray-200 rounded-tr-lg rounded-br-lg rounded-bl-lg p-4 gap-x-4 py-4 pl-4 pr-3 min-w-[100px] max-w-[600px] max-lg:max-w-[300px] text-md justify-between items-center flex"}
                                                        style={{fontFamily: "Montserrat"}}>
                                                        {message?.message.message}
                                                        <div
                                                            className={"flex h-full items-end select-none text-gray-600"}
                                                            style={{fontSize: 9}}>
                                                            {message?.created_at ? (
                                                                new Date(message.created_at).toLocaleTimeString("tr-TR", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            ) : (
                                                                new Date().toLocaleTimeString("tr-TR", {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                                {/*Her mesaj*/}
                                <div ref={messagesEndRef}></div>
                            </div>

                            <div>
                                {/*Mesaj yazma alanı*/}
                                <div className={"flex items-center justify-between gap-x-2 px-2 py-4"}>
                                    <div
                                        className={"text-2xl text-purple-800 rounded cursor-pointer hover:bg-purple-200 p-2 transition duration-200"}>
                                        <BiPlusCircle/></div>
                                    <input
                                        type="text"
                                        placeholder={"Mesaj yaz"}
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                            setPusherMessage(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                // e.preventDefault();
                                                sendMessage();
                                                setIsLoading(true)
                                                setTimeout(() => {
                                                    setIsLoading(false)
                                                }, 300)
                                            }
                                        }}
                                        className={`w-full h-12 max-h-24 p-2 pl-4 bg-gray-200 rounded-xl focus:outline-0 focus:bg-gray-100 hover:bg-gray-100 transition duration-200`}
                                        style={{fontFamily: "Montserrat"}}
                                    />
                                    <div className={"flex items-center justify-center gap-x-2"}>
                                        <div
                                            onClick={() => {
                                                sendMessage()
                                                setIsLoading(true)
                                                setTimeout(() => {
                                                    setIsLoading(false)
                                                }, 300)
                                            }}
                                            className={`bg-purple-700 rounded-full p-2 text-white text-xl cursor-pointer ${isLoading? "hidden" : "block"}`}
                                            style={{fontFamily: "Montserrat"}}
                                        ><BiSolidSend/></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/*Body bitiş*/}

                    </div>
                </div>
            ) : (
                <div className={"w-full h-full flex flex-col bg-white items-center rounded-r-xl max-sm:rounded-none"}>
                    <div className={"flex flex-col items-center justify-center gap-y-4 mt-24 w-full"}>
                        <div
                            className={"w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center text-4xl text-white"}
                            style={{fontFamily: "Montserrat", userSelect: "none"}}>
                            <img
                                src={user?.data?.data?.avatar ?? "https://i.im.ge/2024/01/04/3XfEOh.user.md.png"}
                                alt=""
                                className={"h-full w-full object-cover rounded-full"}
                            />
                        </div>
                        <div className={"text-3xl md:text-xl text-gray-700 font-semibold max-sm:flex max-sm:items-center max-sm:justify-center max-sm:flex-col"} style={{fontFamily: "Montserrat"}}>
                            {/*{user?.data?.data?.username}*/}
                            <div className={"text-3xl md:text-xl text-gray-700 font-semibold"}
                                 style={{fontFamily: "Montserrat"}}>
                                {user?.data?.data?.username}
                            </div>

                            <div className={"flex flex-col justify-center w-[90%] mt-12 gap-x-14 "}>
                                <div>{user?.data?.data?.name}</div>
                                <div>{user?.data?.data?.email}</div>
                                <div style={{fontSize: 3}}>Mustafa</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
