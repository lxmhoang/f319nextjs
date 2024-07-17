import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { Subscription } from "./subscription";

// type Follower = {
//     uid: string,
//     endDate: Date,
//     startDate: Date,
//     perm: boolean,
//     subDocID: string,
// }

export type Expert = {
    id: string;
    imageURL: string;
    name: string;
    phoneNumber?: string;
    follower: Subscription[];
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

    joinDate: number
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
            phoneNumber: expert.phoneNumber,
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
        const follower = data.follower ? data.follower : []

        // console.log('aaaa ' + JSON.stringify(joinDate))
        const expert : Expert =  {
            id: snapshot.id,
            imageURL: data.imageURL,
            name: data.name,
            phoneNumber: data.phoneNumber,
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
            joinDate: data.joinDate,
            visible: data.visible,
            isExpired: new Date(data.expertExpire) < new Date()
        };
        return expert
    },
};

export const expertConverter: FirestoreDataConverter<Expert> = {
    toFirestore(expert: WithFieldValue<Expert>): DocumentData {
        return {
            imageURL: expert.imageURL,
            name: expert.name,
            phoneNumber: expert.phoneNumber,
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
        const follower = data.follower ? data.follower : []

        const expert : Expert =  {
            id: snapshot.id,
            imageURL: data.imageURL,
            name: data.name,
            phoneNumber: data.phoneNumber,
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
            joinDate: data.joinDate,
            isExpired: new Date(data.expertExpire) < new Date()
        };
        return expert
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