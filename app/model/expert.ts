import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";



export type Expert = {
    id: string;
    avatar: string;
    imageURL: string;
    name: string;
    followerNum: number;

    follower: {
        eid: string,
        uid: string,
        endDate: Date,
        perm: boolean,
        subcriptionDocId: string,
    }[];
    permPrice: number;
    monthlyPrice: number;
    selfIntro: string;
    shortIntro: string;
    status: ExpertStatus;
    monthPerform: number;
    weekPerform: number;
    yearPerform: number;
    quarterPerform: number;
}


export const expertAdminConverter: AdminFirestoreDataConverter<Expert> = {
    toFirestore(expert: AdminWithFieldValue<Expert>): AdminDocumentData {
        return {
            avatar: expert.avatar,
            imageURL: expert.imageURL,
            name: expert.name,
            shortIntro: expert.shortIntro,
            selfIntro: expert.selfIntro,
            follower: expert.follower,
            status: expert.status,
            permPrice: expert.permPrice,
            monthlyPrice: expert.monthlyPrice,
        };
    },
    fromFirestore(
        snapshot: AdminQueryDocumentSnapshot
    ): Expert {
        const data = snapshot.data();

        const week = data.curPerformance ? data.curPerformance.week : 1
        const month = data.curPerformance ? data.curPerformance.month : 1
        const quarter = data.curPerformance ? data.curPerformance.quarter : 1
        const year = data.curPerformance ? data.curPerformance.year : 1
        return {
            id: snapshot.id,
            avatar: data.avatar,
            imageURL: data.imageURL,
            name: data.name,
            follower: data.follower ?? [],
            followerNum: data.followerNum ?? 0,
            permPrice: data.permPrice,
            monthlyPrice: data.monthlyPrice,
            shortIntro: data.shortIntro,
            selfIntro: data.selfIntro,
            status: data.status,

            weekPerform: week,
            monthPerform: month,
            quarterPerform: quarter,
            yearPerform: year,
        };
    },
};

export const expertConverter: FirestoreDataConverter<Expert> = {
    toFirestore(expert: WithFieldValue<Expert>): DocumentData {
        return {
            avatar: expert.avatar,
            imageURL: expert.imageURL,
            name: expert.name,
            shortIntro: expert.shortIntro,
            selfIntro: expert.selfIntro,
            follower: expert.follower,
            status: expert.status,
            permPrice: expert.permPrice,
            monthlyPrice: expert.monthlyPrice
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot
    ): Expert {
        const data = snapshot.data();
        const follower = data.follower ? (data.follower as {
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
        const week = data.curPerformance ? data.curPerformance.week : 1
        const month = data.curPerformance ? data.curPerformance.month : 1
        const quarter = data.curPerformance ? data.curPerformance.quarter : 1
        const year = data.curPerformance ? data.curPerformance.year : 1
        return {
            id: snapshot.id,
            avatar: data.avatar,
            imageURL: data.imageURL,
            name: data.name,
            follower: follower,
            followerNum: data.followerNum ?? 0,
            permPrice: data.permPrice,
            monthlyPrice: data.monthlyPrice,
            shortIntro: data.shortIntro,
            selfIntro: data.selfIntro,
            status: ExpertStatus.activated,
            weekPerform: week,
            monthPerform: month,
            quarterPerform: quarter,
            yearPerform: year,
        };
    },
};


export enum ExpertStatus {
    paymentPending = 'paymentPending',
    activated = 'activated',
    suspended = 'suspended',
    banned = 'banned',
    unknown = 'unknown'
}