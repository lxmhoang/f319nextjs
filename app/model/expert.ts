import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

type Follower = {
    uid: string,
    endDate: Date,
    startDate: Date,
    perm: boolean,
    subDocID: string,
}

export type Expert = {
    id: string;
    imageURL: string;
    name: string;
    follower: Follower[];
    permPrice?: number;
    monthlyPrice?: number;
    shortIntro: string;
    status: ExpertStatus;

    monthPerform?: number;
    weekPerform?: number;
    yearPerform?: number;
    quarterPerform?: number;

    expertExpire: number;
    expertType: string;
    isExpired: boolean;
    expertPeriod: string;
    visible: boolean;

    joinDate: Date
}

export const expertRawConverter : AdminFirestoreDataConverter<any> = {
    toFirestore(expert: AdminWithFieldValue<Expert>): AdminDocumentData {
        return expert
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): {} {
        const data = snapshot.data();
        data.id = snapshot.id
        return data
    },
};


export const expertAdminConverter: AdminFirestoreDataConverter<Expert> = {
    toFirestore(expert: AdminWithFieldValue<Expert>): AdminDocumentData {
        return {
            imageURL: expert.imageURL,
            name: expert.name,
            follower: expert.follower ?? [],
            permPrice: expert.permPrice,
            monthlyPrice: expert.monthlyPrice,
            shortIntro: expert.shortIntro,
            expertExpire: expert.expertExpire,
            expertType: expert.expertType,
            expertPeriod: expert.expertPeriod,
            status: expert.status,
            visible: expert.visible,
            joinDate: expert.joinDate
        };
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): Expert {
        const data = snapshot.data();
        const follower = data.follower ? (data.follower as {
            eid: string;
            uid: string;
            startDate: FirebaseFirestore.Timestamp;
            endDate: FirebaseFirestore.Timestamp;
            perm: boolean;
            subDocID: string;
        }[]).map((item) => {
            const follower: Follower = {
                uid: item.uid,
                endDate: new Date((item.endDate as FirebaseFirestore.Timestamp).toDate()),
                startDate: new Date((item.startDate as FirebaseFirestore.Timestamp).toDate()),
                perm: item.perm,
                subDocID: item.subDocID
            }
            return follower
        }) : []

        const joinDate =new Date((data.joinDate as FirebaseFirestore.Timestamp).toDate())
        // console.log('aaaa ' + JSON.stringify(joinDate))
        return {
            id: snapshot.id,
            imageURL: data.imageURL,
            name: data.name,
            follower: follower,
            permPrice: data.permPrice,
            monthlyPrice: data.monthlyPrice,
            shortIntro: data.shortIntro,
            status: data.status,
            expertPeriod: data.expertPeriod,
            expertType: data.expertType,
            expertExpire: data.expertExpire,
            weekPerform: data.weekPerform,
            monthPerform: data.monthPerform,
            quarterPerform: data.quarterPerform,
            yearPerform: data.yearPerform,
            joinDate: joinDate,
            visible: data.visible,
            isExpired: new Date(data.expertExpire) < new Date()
        };
    },
};

export const expertConverter: FirestoreDataConverter<Expert> = {
    toFirestore(expert: WithFieldValue<Expert>): DocumentData {
        return {
            imageURL: expert.imageURL,
            name: expert.name,
            follower: expert.follower ?? [],
            permPrice: expert.permPrice,
            monthlyPrice: expert.monthlyPrice,
            shortIntro: expert.shortIntro,
            expertExpire: expert.expertExpire,
            expertType: expert.expertType,
            expertPeriod: expert.expertPeriod,
            status: expert.status,
            visible: expert.visible,
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot
    ): Expert {
        const data = snapshot.data();
        const follower = data.follower ? (data.follower as {
            eid: string;
            uid: string;
            startDate: FirebaseFirestore.Timestamp;
            endDate: FirebaseFirestore.Timestamp;
            perm: boolean;
            subDocID: string;
        }[]).map((item) => {
            const follower: Follower = {
                uid: item.uid,
                endDate: new Date((item.endDate as FirebaseFirestore.Timestamp).toDate()),
                startDate: new Date((item.startDate as FirebaseFirestore.Timestamp).toDate()),
                perm: item.perm,
                subDocID: item.subDocID
            }
            return follower
        }) : []

        const joinDate = new Date((data.joinDate as FirebaseFirestore.Timestamp).toDate())
        return {
            id: snapshot.id,
            imageURL: data.imageURL,
            name: data.name,
            follower: follower,
            permPrice: data.permPrice,
            monthlyPrice: data.monthlyPrice,
            shortIntro: data.shortIntro,
            status: ExpertStatus.activated,
            visible: data.visible,
            weekPerform: data.weekPerform,
            monthPerform: data.monthPerform,
            quarterPerform: data.quarterPerform,
            yearPerform: data.yearPerform,
            expertPeriod: data.expertPeriod,
            expertExpire: data.expertExpire,
            expertType: data.expertType,
            joinDate: joinDate,
            isExpired: new Date(data.expertExpire) < new Date()
        };
    },
};


export enum ExpertStatus {
    paymentPending = 'paymentPending',
    activated = 'activated',
    expired = 'expired',
    suspended = 'suspended',
    banned = 'banned',
    unknown = 'unknown'
}