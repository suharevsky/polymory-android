import {BaseModel} from '../crud-table';

export interface UserModel extends BaseModel {
    id: string;
    uid: string;
    firstName: string;
    isAdmin: boolean;
    height: number;
    bodyType: number;
    maritalStatus: string;
    lastName: string;
    email: string;
    username: string;
    about: string;
    subscriptionStart: string;
    subscriptionEnd: string;
    preference: string[];
    photos: any;
    photo: string;
    lookingFor: string[];
    area: string;
    city: string;
    gender: number;
    refreshToken: string;
    inbox: string[];
    viewedList: string[];
    blockList: string[];
    favoriteList: string[];
    status: number; // 1 - Active | Pending | Banned | Frozen | 0 - Deleted
    birthday: string;
    birthday1: string;
    registrationDate: string;
    ipAddress: string;
    socialAuthId: string;
    expiresIn: Date | string;
    subscription: boolean;
    accessToken: string;
}
