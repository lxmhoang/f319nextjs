import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";


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

    following: {
        eid: string,
        uid: string,
        endDate: Date,
        perm: boolean,
        subcriptionDocId: string,
    }[];
    metadata?: {};
    phoneNumber?: string
    isAdmin?: boolean,
    isExpert?: boolean,
    expertExpire?: number
    expertType?: string
}


export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: WithFieldValue<User>): DocumentData {
        return {
            following: user.following,
            accessId: user.accessId,
            uid: user.uid,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled,
            email: user.email,
            customClaims: user.customClaims,
            metadata: user.metadata,
            phoneNumber: user.phoneNumber
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options);
        const following = data.following ? (data.following as {
            eid: string;
            uid: string;
            endDate: FirebaseFirestore.Timestamp;
            perm: boolean;
            subcriptionDocId: string;
        }[]).map((item) => {
            return {
                eid: item.eid,
                uid: item.uid,
                perm: item.perm,
                subcriptionDocId: item.subcriptionDocId,
                endDate: item.endDate.toDate()
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
            metadata: data.metadata,
            customClaims: data.customClaims,
            phoneNumber: data.phoneNumber,
            isAdmin: data.email == 'lxmhoang@gmail.com' ? true : data.isAdmin ?? false,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert,
            following: following
        };
    },
};


export const userAdminConverter: AdminFirestoreDataConverter<User> = {
    toFirestore(user: AdminWithFieldValue<User>): AdminDocumentData {
        return {
            uid: user.uid,
            displayName: user.displayName,
            amount: user.amount,
            disabled: user.disabled,
            email: user.email,
            customClaims: user.customClaims,
            metadata: user.metadata,
            phoneNumber: user.phoneNumber
        };
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): User {
        const data = snapshot.data();
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
            following: data.following ?? {},
            metadata: data.metadata,
            customClaims: data.customClaims,
            phoneNumber: data.phoneNumber,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            isExpert: isExpert
        };
    },
};
