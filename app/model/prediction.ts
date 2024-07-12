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
    dateIn: number;
    priceIn: number;
    priceOut: number;
    cutLoss: number;
    deadLine: number;
    dateRelease?: number;
    priceRelease?: number;
    status: string;
    note: string;
    portion: number;
    long?: boolean
  }


export type PredictionReview = {
  id: string | undefined,
  assetName: string,
  priceIn: string,
  priceOut: string,
  deadLine: string,
  dateIn: string,
  cutLoss: string,
  curPrice: string,
  status: string,
  portion: string,
  curStatus: string
  disableClose: boolean
}

export const predAdminConverter: AdminFirestoreDataConverter<Prediction> = {
  toFirestore(pred: AdminWithFieldValue<Prediction>): AdminDocumentData {
    // const dateIntimeStamp = pred.dateIn as Timestamp
    // const dateIn = new Date(Number(dateIntimeStamp))
    return pred.dateRelease ?  {
      assetName: pred.assetName,
      ownerId: pred.ownerId,
      dateIn: pred.dateIn,
      priceIn: pred.priceIn,
      priceOut: pred.priceOut,
      cutLoss: pred.cutLoss,
      deadLine: pred.deadLine,
      note: pred.note,
      status: pred.status,
      portion: pred.portion,
      long: pred.long ?? true,
      dateRelease: pred.dateRelease,
      priceRelease: pred.priceRelease
    } : 
    {
      assetName: pred.assetName,
      ownerId: pred.ownerId,
      dateIn: pred.dateIn,
      priceIn: pred.priceIn,
      priceOut: pred.priceOut,
      cutLoss: pred.cutLoss,
      deadLine: pred.deadLine,
      note: pred.note,
      status: pred.status,
      portion: pred.portion,
      long: pred.long ?? true,
    }
  },
  fromFirestore(
    snapshot: AdminQueryDocumentSnapshot,
  ): Prediction {
    const data = snapshot.data();
    return {
      assetName: data.assetName,
      ownerId: data.ownerId,
      dateIn: data.dateIn,
      priceIn: data.priceIn,
      priceOut: data.priceOut,
      cutLoss: data.cutLoss,
      deadLine: data.deadLine,
      dateRelease: data.dateRelease,
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
      dateIn: data.dateIn,
      priceIn: data.priceIn,
      priceOut: data.priceOut,
      cutLoss: data.cutLoss,
      deadLine: data.deadLine,
      dateRelease: data.dateRelease,
      priceRelease: data.priceRelease,
      id: snapshot.id,
      note: data.note,
      status: data.status ?? "Unknown",
      portion: data.portion
    };
  },
};



// let parserCompRTInfo = (array: { [key: string]: any }[]) => {
//     if (array.length == 0)
//         return null
//     const data = array[0]
//     const result: CompanyRTInfo = {
//         code: data.a,
//         thamChieu: data.b,
//         maxPrice: data.c,
//         minPrice: data.d,
//         muagia3Price: data.e,
//         muagia3Volume: data.f,
//         muagia2Price: data.g,
//         muagia2Volume: data.h,
//         muagia1Price: data.i,
//         muagia1Volume: data.j,
//         khoplenhTangGiam: data.k,
//         khoplenhPrice: data.l,
//         khoplenhVolume: data.m,
//         khoplenhTotalVolume: data.n,
//         bangia1Price: data.o,
//         bangia1Volume: data.p,
//         bangia2Price: data.q,
//         bangia2Volume: data.r,
//         bangia3Price: data.s,
//         bangia3Volume: data.t,
//         u: data.u,
//         khoplenhMax: data.v,
//         khoplenhMin: data.w,
//         nuocngoaiBuy: data.x,
//         nuocngoaiSell: data.t,
//         z: data.a,
//         time: data.time,
//         tb: data.tb,
//         ts: data.ts
//     }

//     return result;
// }