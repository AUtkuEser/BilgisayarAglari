import {AxiosInstance} from "axios";

export interface IModel {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface IUser extends IModel {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    token: string;
    pivot?: IChatRoomUser;
    chatRooms?: IChatRoom[];
    messages?: IMessage[];
}

export interface IChatRoomUser extends IModel {
    user_id: number;
    chat_room_id: number;
    user?: IUser;
    chat_room?: IChatRoom;
}

// export interface IMessage extends IModel {
//     username: string;
//     message: string;
// }

export interface IMessage extends IModel {
    id: number;
    chat_room_id: number;
    user_id: number;
    message: string;
    image: string;
    video: string;
    audio: string;
    document: string;
    sticker: string;
    gif: string;
    created_at: string;
    updated_at: string;
}

export interface ILastMessages extends IModel {
    message: IMessage
}

export interface IChatRoom extends IModel {
    name: string;
    users: IUser[];
    messages?: IMessage[];
    photo_url: string;
}

export interface IChatRoomBox extends IModel {
    chatRooms: IChatRoom;
    lastMessage: IMessage;
}

declare global {
    interface Window {
        axios: AxiosInstance;
    }
}
