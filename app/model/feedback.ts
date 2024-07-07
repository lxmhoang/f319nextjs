
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { 
    DocumentData as AdminDocumentData, 
    FirestoreDataConverter as AdminFirestoreDataConverter, 
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue } from "firebase-admin/firestore";

export type FeedBack = {
    id?: string
    uid: string
    content: string
    dateTime: number
    contact: string,
    status: string
}

export const feedBackConverter: FirestoreDataConverter<FeedBack> = {
    toFirestore(item: WithFieldValue<FeedBack>): DocumentData {
      return {
        dateTime: item.dateTime,
        uid: item.uid,
        content: item.content,
        contact: item.contact,
      };
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): FeedBack {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        uid: data.uid,
        dateTime: data.dateTime,
        contact: data.contact,
        content: data.content,
        status: data.status
      };
    },
  };
  

export const feedBackAdminConverter: AdminFirestoreDataConverter<FeedBack> = {
    toFirestore(item: AdminWithFieldValue<FeedBack>): AdminDocumentData {
        return {
            dateTime: item.dateTime,
            uid: item.uid,
            content: item.content,
            contact: item.contact,
            status: item.status
          };
    },
    fromFirestore(
      snapshot: AdminQueryDocumentSnapshot,
    ): FeedBack {
        const data = snapshot.data();
        return {
            id: snapshot.id,
            uid: data.uid,
            dateTime: data.dateTime,
            contact: data.contact,
            content: data.content,
            status: data.status
        };
    },
  };