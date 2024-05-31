import { 
  DocumentData as AdminDocumentData, 
  FirestoreDataConverter as AdminFirestoreDataConverter, 
  QueryDocumentSnapshot as AdminQueryDocumentSnapshot,
  WithFieldValue as AdminWithFieldValue } from "firebase-admin/firestore";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export type Prediction = {
    id?: string;
    ownerId: string;
    assetName: string;
    dateIn: Date;
    priceIn: number;
    priceOut: number;
    cutLoss: number;
    deadLine: Date;
    dateRelease?: Date;
    priceRelease?: number;
    status: string;
    note: string;
    portion: number;
    long?: boolean
  }

export const predAdminConverter: AdminFirestoreDataConverter<Prediction> = {
  toFirestore(pred: AdminWithFieldValue<Prediction>): AdminDocumentData {
    // const dateIntimeStamp = pred.dateIn as Timestamp
    // const dateIn = new Date(Number(dateIntimeStamp))
    return {
      assetName: pred.assetName,
      dateIn: pred.dateIn,
      priceIn: pred.priceIn,
      priceOut: pred.priceOut,
      cutLoss: pred.cutLoss,
      deadLine: pred.deadLine,
      note: pred.note,
      status: pred.status,
      portion: pred.portion,
      ownerId: pred.ownerId,
      long: pred.long ?? true,
      dateRelease: pred.dateRelease,
      priceRelease: pred.priceRelease,
    };
  },
  fromFirestore(
    snapshot: AdminQueryDocumentSnapshot,
  ): Prediction {
    const data = snapshot.data();
    const dateRelease = data.dateRelease ?  (data.dateRelease as FirebaseFirestore.Timestamp).toDate() : undefined
    return {
      assetName: data.assetName,
      ownerId: data.ownerId,
      dateIn: (data.dateIn as FirebaseFirestore.Timestamp).toDate(),
      priceIn: data.priceIn,
      priceOut: data.priceOut,
      cutLoss: data.cutLoss,
      deadLine: (data.deadLine as FirebaseFirestore.Timestamp).toDate(),
      dateRelease: dateRelease,
      priceRelease: data.priceRelease,
      id: snapshot.id,
      note: data.note,
      status: data.status,
      portion: data.portion
    };
  },
};


export const predConverter: FirestoreDataConverter<Prediction> = {
  toFirestore(pred: WithFieldValue<Prediction>): DocumentData {
    return {
      assetName: pred.assetName,
      dateIn: pred.dateIn,
      priceIn: pred.priceIn,
      priceOut: pred.priceOut,
      cutLoss: pred.cutLoss,
      deadLine: pred.deadLine,
      dateRelease: pred.dateRelease,
      priceRelease: pred.priceRelease,
      note: pred.note,
      status: pred.status,
      portion: pred.portion
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Prediction {
    const data = snapshot.data(options);
    console.log('data from firestore' + JSON.stringify(data))
    return {
      assetName: data.assetName,
      ownerId: data.ownerId,
      dateIn: (data.dateIn as FirebaseFirestore.Timestamp).toDate(),
      priceIn: data.priceIn,
      priceOut: data.priceOut,
      cutLoss: data.cutLoss,
      deadLine: (data.deadLine as FirebaseFirestore.Timestamp).toDate(),
      dateRelease: data.dateRelease,
      priceRelease: data.priceRelease,
      id: snapshot.id,
      note: data.note,
      status: data.status ?? "Unknown",
      portion: data.portion
    };
  },
};
