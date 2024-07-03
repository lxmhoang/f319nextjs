import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { UserNoti } from "./noti";

type Following = {
    eid: string,
    endDate: Date,
    startDate: Date,
    perm: boolean,
    subDocID: string,
}

export type User = {
    uid: string;
    accessId: string;
    displayName: string;
    photoURL: string;
    amount: number;
    disabled: boolean;
    email?: string;
    customClaims: {
        isAdmin: boolean,
        expertExpire: boolean
    };
    notifies: UserNoti[],

    following: Following[];
    metadata?: {};
    phoneNumber?: string
    isAdmin?: boolean,
    isExpert?: boolean,
    expertExpire?: number,
    expertType?: string,
    refID?: string,
    joinRank: boolean,
    rankExpire?: Date
}

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: WithFieldValue<User>): DocumentData {
        const data =  {
            following: user.following,
            accessId: user.accessId,
            uid: user.uid,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled,
            email: user.email,
            customClaims: user.customClaims,
            metadata: user.metadata,
            phoneNumber: user.phoneNumber,
            refID: user.refID,
            notifies: user.notifies
        }
        return data
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options);

    //   console.log('check notifies' + JSON.stringify(data.notifies))
        const notifies = data.notifies ? data.notifies.map((item: 
            {   title: string; 
                dateTime: number; 
                content: string; 
                urlPath? :string 
            }) => {
                const noti : UserNoti = {
                    title: item.title,
                    dateTime: item.dateTime,
                    content: item.content,
                    urlPath: item.urlPath
                }

                console.log('check notifies' + JSON.stringify(noti))

                return noti

        }) : []
        const following : Following[] = data.following ? (data.following as {
            eid: string;
            uid: string;
            startDate: FirebaseFirestore.Timestamp;
            endDate: FirebaseFirestore.Timestamp;
            perm: boolean;
            subDocID: string;
        }[]).map((item) => {
            return {
                eid: item.eid,
                perm: item.perm,
                subDocID: item.subDocID,
                endDate: new Date((item.endDate as FirebaseFirestore.Timestamp).toDate()),
                startDate: new Date((item.startDate as FirebaseFirestore.Timestamp).toDate()),
            }
        }) : []
        // console.log('kkk ' + data.expertExpire)
        const isExpert = data.expertExpire ? 
        new Date(Number(data.expertExpire)) > new Date()
        : 
        false 
        console.log('is Expert ? ' + new Date(Number(data.expertExpire)))

        const joinRank = data.rankExpire ? ((data.rankExpire as  FirebaseFirestore.Timestamp).toDate() > new Date()) : false

        return {
            uid: snapshot.id,
            accessId: data.accessId,
            displayName: data.displayName,
            photoURL: data.photoURL,
            amount: data.amount,
            disabled: data.disabled,
            email: data.email,
            metadata: data.metadata,
            customClaims: data.customClaims,
            phoneNumber: data.phoneNumber,
            isAdmin: data.email == 'lxmhoang@gmail.com' ? true : data.isAdmin ?? false,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert,
            following: following,
            refID: data.refID,
            joinRank: joinRank,
            rankExpire: data.rankExpire ? (data.rankExpire as  FirebaseFirestore.Timestamp).toDate() : undefined,
            notifies: notifies
        };
    },
};


export const userAdminConverter: AdminFirestoreDataConverter<User> = {
    toFirestore(user: AdminWithFieldValue<User>): AdminDocumentData {
       
        const obj : any = {
            uid: user.uid,
            accessId: user.accessId,
            photoURL: user.photoURL,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled ?? false,
            email: user.email,
            customClaims: user.customClaims,
            following: user.following ?? [],
            metadata: user.metadata ?? {},
            expertExpire: user.expertExpire,
            expertType: user.expertType,
            phoneNumber: user.phoneNumber,
            refID: user.refID,


            notifies: user.notifies
        }
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        return obj;
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): User {
        const data = snapshot.data();
        const joinRank = data.rankExpire ? ((data.rankExpire as  FirebaseFirestore.Timestamp).toDate() > new Date()) : false

     
        const following : Following[] = data.following ? (data.following as {
            eid: string;
            uid: string;
            startDate: FirebaseFirestore.Timestamp;
            endDate: FirebaseFirestore.Timestamp;
            perm: boolean;
            subDocID: string;
        }[]).map((item) => {
            return {
                eid: item.eid,
                perm: item.perm,
                subDocID: item.subDocID,
                endDate: new Date((item.endDate as FirebaseFirestore.Timestamp).toDate()),
                startDate: new Date((item.startDate as FirebaseFirestore.Timestamp).toDate()),
            }
        }) : []
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
            disabled: data.disabled,
            email: data.email,
            following: following,
            metadata: data.metadata,
            customClaims: data.customClaims,
            phoneNumber: data.phoneNumber,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert,
            joinRank: joinRank,
            rankExpire: data.rankExpert ? (data.rankExpire as  FirebaseFirestore.Timestamp).toDate() : undefined,
            notifies: data.notifies
        };
    },
};


export const userRawConverter: AdminFirestoreDataConverter<any> = {
    toFirestore(user: AdminWithFieldValue<User>): AdminDocumentData {
       
        const obj : any = {
            uid: user.uid,
            accessId: user.accessId,
            photoURL: user.photoURL,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled ?? false,
            email: user.email,
            customClaims: user.customClaims,
            following: user.following ?? [],
            metadata: user.metadata ?? {},
            expertExpire: user.expertExpire,
            expertType: user.expertType,
            phoneNumber: user.phoneNumber,
            refID: user.refID,
            notifies: user.notifies
        }
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        return obj;
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): any {
        const data = snapshot.data();
        data.id = snapshot.id
        // const joinRank = data.rankExpire ? ((data.rankExpire as  FirebaseFirestore.Timestamp).toDate() > new Date()) : false

     
        // const following : Following[] = data.following ? (data.following as {
        //     eid: string;
        //     uid: string;
        //     startDate: FirebaseFirestore.Timestamp;
        //     endDate: FirebaseFirestore.Timestamp;
        //     perm: boolean;
        //     subDocID: string;
        // }[]).map((item) => {
        //     return {
        //         eid: item.eid,
        //         perm: item.perm,
        //         subDocID: item.subDocID,
        //         endDate: new Date((item.endDate as FirebaseFirestore.Timestamp).toDate()),
        //         startDate: new Date((item.startDate as FirebaseFirestore.Timestamp).toDate()),
        //     }
        // }) : []
        // const isExpert = data.expertExpire ? 
        // new Date(Number(data.expertExpire)) > new Date()
        // : 
        // false 
        return data;
    },
};
