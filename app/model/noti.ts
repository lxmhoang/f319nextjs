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
}


export const notiConverter: FirestoreDataConverter<UserNoti> = {
    toFirestore(item: WithFieldValue<UserNoti>): DocumentData {
      return {
        dateTime: item.dateTime,
        content: item.content,
        urlPath: item.urlPath,
        title: item.title
      };
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): UserNoti {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        dateTime: (new Date((data.date as FirebaseFirestore.Timestamp).toDate())).getTime(),
        title: data.title,
        content: data.content,
        urlPath: data.urlPath
      };
    },
  };
  

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
          urlPath: data.urlPath
        };
    },
  };