import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { UserNoti } from "./noti";
import { Subscription } from "./subscription";
import { DataSnapshot } from "firebase/database";
import { arrayFromData, dataFromArray } from "../lib/utils";
import { Transaction } from "./transaction";

export type User = {
    uid: string;
    accessId: string;
    displayName: string;
    photoURL: string;
    amount: number;
    disabled: boolean;
    email?: string;

    metadata?: {};
    phoneNumber?: string
    refID?: string,

    transaction: Transaction[],
    notifies: UserNoti[],
    follower: Subscription[],
    following: Subscription[];


    isAdmin?: boolean,

    
    expertType?: string,
    expertExpire?: number,
    isExpert?: boolean,
    joinDate: number,

    rankExpire?: number,
    joinRank: boolean,
}

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: WithFieldValue<User>): DocumentData {
        const data = {
            accessId: user.accessId,
            uid: user.uid,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled,
            email: user.email,
            metadata: user.metadata,
            phoneNumber: user.phoneNumber,
            refID: user.refID,
            
            notifies: user.notifies,
            transaction: [],
            follower: user.follower,
            following: user.following,
            joinDate: user.joinDate
        }
        return data
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options);
        
        const isExpert = data.expertExpire ?
           data.expertExpire > Date.now()
            :
            false
        console.log('is Expert ? ' + new Date(Number(data.expertExpire)))

        const joinRank = data.rankExpire ? (data.rankExpire  > Date.now()) : false

        const user: User = {
            uid: snapshot.id,
            accessId: data.accessId,
            displayName: data.displayName,
            photoURL: data.photoURL,
            amount: data.amount,
            disabled: data.disabled,
            email: data.email,
            metadata: data.metadata,
            phoneNumber: data.phoneNumber,
            isAdmin: data.email == 'lxmhoang@gmail.com' ? true : data.isAdmin ?? false,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert,
            following: data.following ?? [],
            refID: data.refID,
            joinRank: joinRank,
            rankExpire: data.rankExpire,
            notifies:  data.notifies ?? [],
            transaction: [],
            follower: data.follower ?? [],
            joinDate: data.joinDate,
        };
        return user
    },
};

export const userRTDBConverter = {
    fromRTDB: (snapshot: DataSnapshot) => {
        const data = snapshot.val()


        const joinRank = data.rankExpire ? (data.rankExpire > Date.now()) : false
        const isExpert = data.expertExpire ?
            data.expertExpire > Date.now()
            :
            false
        const user: User = {
            uid: snapshot.ref.key ?? "",
            accessId: data.accessId,
            displayName: data.displayName,
            photoURL: data.photoURL,
            amount: data.amount,
            refID: data.refID,
            disabled: data.disabled,
            email: data.email,
            metadata: data.metadata,
            phoneNumber: data.phoneNumber,
            isAdmin: data.email == 'lxmhoang@gmail.com' ? true : data.isAdmin ?? false,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert,
            joinRank: joinRank,
            rankExpire: data.rankExpert,
            notifies: arrayFromData<UserNoti>(data.notifies).sort((a,b) => { 
                return b.dateTime - a.dateTime}) ,
            transaction: arrayFromData<Transaction>(data.trans).sort((a,b) => { 
                return b.date - a.date})  ,
            follower: arrayFromData<Subscription>(data.follower) ,
            following: arrayFromData<Subscription>(data.following) ,
            joinDate: data.joinDate,
        };
        return user

    },
    toRTDB: (user: User) => {

        const obj: any = {
            uid: user.uid,
            accessId: user.accessId,
            photoURL: user.photoURL,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled ?? false,
            email: user.email,
            following: dataFromArray<Subscription>(user.following),
            follower: dataFromArray<Subscription>(user.follower),
            transaction: dataFromArray<Transaction>(user.transaction),
            metadata: user.metadata ?? {},
            expertExpire: user.expertExpire,
            expertType: user.expertType,
            phoneNumber: user.phoneNumber,
            refID: user.refID,
            notifies: dataFromArray<UserNoti>(user.notifies),
            joinDate: user.joinDate
        }

        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        return obj;

    }
}


export const userAdminConverter: AdminFirestoreDataConverter<User> = {
    toFirestore(user: AdminWithFieldValue<User>): AdminDocumentData {
        const obj: any = {
            uid: user.uid,
            accessId: user.accessId,
            photoURL: user.photoURL,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled ?? false,
            email: user.email,
            metadata: user.metadata ?? {},
            expertExpire: user.expertExpire,
            expertType: user.expertType,
            phoneNumber: user.phoneNumber,
            refID: user.refID,


            notifies: user.notifies ?? [],
            following: user.following ?? [],
            follower: user.follower ?? [],
            joinDate: user.joinDate
        }
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        return obj;
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): User {
        const data = snapshot.data();
        const joinRank = data.rankExpire ? (data.rankExpire  > Date.now()) : false


        const following = data.following ? data.following : []
        const follower = data.follower ? data.follower : []
        const isExpert = data.expertExpire ?
            new Date(Number(data.expertExpire)) > new Date()
            :
            false
        return {
            uid: snapshot.id,
            accessId: data.accessId,
            displayName: data.displayName,
            photoURL: data.photoURL,
            amount: data.amount,
            refID: data.refID,
            disabled: data.disabled,
            email: data.email,
            following: following,
            metadata: data.metadata,
            phoneNumber: data.phoneNumber,
            isAdmin: data.email == 'lxmhoang@gmail.com' ? true : data.isAdmin ?? false,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert,
            joinRank: joinRank,
            rankExpire: data.rankExpert,
            follower: data.follower,
            notifies: data.notifies,
            transaction: [],
            joinDate: data.joinDate,
        };
    },
};


export const userRawConverter: AdminFirestoreDataConverter<any> = {
    toFirestore(user: AdminWithFieldValue<User>): AdminDocumentData {

        const obj: any = {
            uid: user.uid,
            accessId: user.accessId,
            photoURL: user.photoURL,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled ?? false,
            email: user.email,
            following: user.following ?? [],
            follower: user.follower ?? [],
            metadata: user.metadata ?? {},
            expertExpire: user.expertExpire,
            expertType: user.expertType,
            phoneNumber: user.phoneNumber,
            refID: user.refID,
            notifies: user.notifies,
            transaction: [],
            joinDate: user.joinDate,
        }
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        return obj;
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): any {
        const data = snapshot.data();
        data.id = snapshot.id
        return data;
    },
};
