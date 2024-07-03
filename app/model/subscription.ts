
import { 
    DocumentData as AdminDocumentData, 
    FirestoreDataConverter as AdminFirestoreDataConverter, 
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue } from "firebase-admin/firestore";
  import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

  
export type Subscription = {
    id?: string,
    uid: string;
    eid: string;
    startDate: Date;
    endDate?: Date;
    perm: boolean;
    value: number;
    type: "solo" | "rank"
  }
  
  
  export const subscriptionConverter: FirestoreDataConverter<Subscription> = {
    toFirestore(sub: WithFieldValue<Subscription>): DocumentData {
      return {
        uid: sub.uid,
        eid: sub.eid,
        startDate: sub.startDate,
        value: sub.value,
        perm: sub.perm,
        type: sub.type
      };
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Subscription {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        uid: data.uid,
        eid: data.eid,
        startDate: (data.startDate  as FirebaseFirestore.Timestamp).toDate() ,
        perm: data.perm,
        value: data.value,
        endDate: data.endDate ?? undefined,
        type: data.type == 'solo' ? "solo" : "rank"
      };
    },
  };



  export const subscriptionAdminConverter: AdminFirestoreDataConverter<Subscription> = {
    toFirestore(sub: AdminWithFieldValue<Subscription>): AdminDocumentData {

      return {
        uid: sub.uid,
        eid: sub.eid,
        startDate: sub.startDate,
        value: Number(sub.value),
        perm: sub.perm,
        type: sub.type
      } 
    },
    fromFirestore(
      snapshot: AdminQueryDocumentSnapshot
    ): Subscription {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        uid: data.uid,
        eid: data.eid,
        startDate: (data.startDate  as FirebaseFirestore.Timestamp).toDate() ,
        perm: data.perm,
        value: data.value,
        endDate: data.endDate ? (data.endDate as FirebaseFirestore.Timestamp).toDate() : undefined,
        type: data.type == 'solo' ? 'solo' : 'rank'
      };
    },
  };

