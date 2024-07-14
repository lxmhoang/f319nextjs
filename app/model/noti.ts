import { DocumentData, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { 
    DocumentData as AdminDocumentData, 
    FirestoreDataConverter as AdminFirestoreDataConverter, 
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue } from "firebase-admin/firestore";


export type UserNoti = {
    id?: string
    title: string
    dateTime: number
    content: string
    urlPath?: string
    tapTime?: number
}

export const notiAdminConverter: AdminFirestoreDataConverter<UserNoti> = {
    toFirestore(item: AdminWithFieldValue<UserNoti>): AdminDocumentData {
        return {
            dateTime: item.dateTime,
            content: item.content,
            title: item.title,
            urlPath: item.urlPath ?? ""
          };
    },
    fromFirestore(
      snapshot: AdminQueryDocumentSnapshot,
    ): UserNoti {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          dateTime: data.dateTime,
          content: data.content,
          title: data.title,
          urlPath: data.urlPath,
          tapTime: data.tapTime
        };
    },
  };

  