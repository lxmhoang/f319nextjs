import {
    DocumentData as AdminDocumentData,
    FirestoreDataConverter as AdminFirestoreDataConverter,
    QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
    WithFieldValue as AdminWithFieldValue
} from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";


export type Transaction = {
    id?: string;
    tranType: string;
    toUid: string;
    fromUid: string;
    amount: number;
    date: Date
    note?: string
    imageURL?: string[]
    notebankacc?: string
    status: string
  }

  export const transConverter: FirestoreDataConverter<Transaction> = {
    toFirestore(trans: WithFieldValue<Transaction>): DocumentData {
      return {
        id: trans.id,
        toUid: trans.toUid,
        fromUid: trans.fromUid,
        amount: trans.amount,
        date: trans.date,
        imageURL: trans.imageURL,
        notebankacc: trans.notebankacc,
        status: trans.status
      };
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): Transaction {
      const data = snapshot.data(options);
      return {
        toUid: data.toUid,
        fromUid: data.fromUid,
        amount: data.amount,
        tranType: data.tranType,
        date: (data.date as FirebaseFirestore.Timestamp).toDate(),
        imageURL: data.imageURL,
        note: data.note,
        id: snapshot.id,
        notebankacc: data.notebankacc,
        status: data.status
      };
    },
  };
  

export const tranAdminConverter: AdminFirestoreDataConverter<Transaction> = {
    toFirestore(trans: AdminWithFieldValue<Transaction>): AdminDocumentData {
      return {
        // id: trans.id,
        tranType: trans.tranType,
        toUid: trans.toUid,
        fromUid: trans.fromUid,
        amount: Number(trans.amount),
        date: trans.date,
        imageURL: trans.imageURL,
        notebankacc: trans.notebankacc,
        status: trans.status
      };
    },
    fromFirestore(
      snapshot: AdminQueryDocumentSnapshot,
    ): Transaction {
      const data = snapshot.data();
      return {
        toUid: data.toUid,
        fromUid: data.fromUid,
        amount: Number(data.amount),
        tranType: data.tranType,
        date: data.date,
        imageURL: data.imageURL,
        note: data.note,
        id: snapshot.id,
        notebankacc: data.notebankacc,
        status: data.status
      };
    },
  };