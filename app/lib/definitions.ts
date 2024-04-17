import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export type CustomerField = {
  id: string;
  name: string;
};

export type SearchUserField = {

}

// https://liveboard.cafef.vn/
export type CompanyRTInfo = {
  code: string; //a 
  thamChieu: number; //b
  maxPrice: number; //c
  minPrice: number; //d

  muagia3Price: number; //e
  muagia3Volume: number; //f
  muagia2Price: number; //g
  muagia2Volume: number; //h
  muagia1Price: number; //i
  muagia1Volume: number; //j

  khoplenhTangGiam: number; //k
  khoplenhPrice: number; //l 
  khoplenhVolume: number; //m
  khoplenhTotalVolume: number; //n


  bangia1Price: number; //o
  bangia1Volume: number; //p
  bangia2Price: number; //q
  bangia2Volume: number; //r
  bangia3Price: number; //s 
  bangia3Volume: number; //t

  u: number; //u

  khoplenhMax: number; //v
  khoplenhMin: number; //w


  nuocngoaiBuy: number; //x
  nuocngoaiSell: number; //y

  z: number; //z 
  time: string;
  tb:number;
  ts:number;


}

// export type Company = {
//   Symbol: string;
//   CenterId: number;
//   ReferencePrice: number;
//   FloorPrice: number;
//   CeilPrice: number;
//   BuyPrice1: number;
//   BuyVolume1: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
//   ReferencePrice: number;
// }

export type Prediction = {
  assetName: string;
  dateIn: Date;
  dateOut: Date;
  priceIn: number;
  priceOut: number;
  cutLoss: number;
  status: string;
}

export type User = {
  uid: string;
  displayName: string;
  amount: number;
  disabled: boolean;
  email?: string;
  customClaims?: {};
  metadata?: {};
  phoneNumber?: string
}

export type Expert = {
  avatar: string;
  imageURL: string;
  id: string;
  name: string;
  followerNum: number;
  selfIntro: string;
  shortInfo: string;
  status: ExpertStatus;
}

export type Transaction = {
  id?: string;
  tranType: string;
  toUid: string;
  fromUid: string;
  amount: number;
  date?: Date
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
      date: data.date,
      imageURL: data.imageURL,
      note: data.note,
      id: snapshot.id,
      notebankacc: data.notebankacc,
      status: data.status
    };
  },
};

export const expertConverter: FirestoreDataConverter<Expert> = {
  toFirestore(expert: WithFieldValue<Expert>): DocumentData {
    return { imageURL: expert.imageURL, name: expert.name, shortInfo: expert.shortInfo };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Expert {
    const data = snapshot.data(options);
    return {
      avatar: data.avatar,
      imageURL: data.imageURL,
      id: snapshot.id,
      shortInfo: data.shortInfo,
      name: data.name,
      followerNum: data.followerNum,
      selfIntro: data.selfIntro,
      status: data.status
    };
  },
};


export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      uid: user.uid,
      displayName: user.displayName,
      amount: user.amount,
      disabled: user.disabled,
      email: user.email,
      customClaims: user.customClaims,
      metadata: user.metadata,
      phoneNumber: user.phoneNumber
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      uid: snapshot.id,
      displayName: data.displayName,
      amount: data.amount,
      disabled: data.disabled,
      metadata: data.metadata,
      customClaims: data.customClaims,
      phoneNumber: data.phoneNumber,
      email: data.email,

    };
  },
};

// export const superUser

export enum ExpertStatus {
  paymentPending = 'paymentPending',
  activated = 'activated',
  suspended = 'suspended',
  banned = 'banned',
  unknown = 'unknown'
}