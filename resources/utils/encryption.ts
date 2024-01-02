import CryptoJS from "crypto-js";
import {IUser} from "../../../../New folder/Arşiv2/resources/js";

export function encryptString(string: string, key: string): string {
    return CryptoJS.AES.encrypt(string, key).toString();
}

export function decryptString(string: string, key: string): string {
    return CryptoJS.AES.decrypt(string, key).toString(CryptoJS.enc.Utf8);
}

export function makeKey(user1token: string, user2token: string, user1Id: number, user2Id: number): string {
    if (user1Id < user2Id) {
        return `${user1token}${user2token}`;
    }

    return `${user2token}${user1token}`;
}
