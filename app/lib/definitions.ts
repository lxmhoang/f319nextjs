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
  tb: number;
  ts: number;


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
  id?: string;
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
}

export type User = {
  uid: string;
  displayName: string;
  amount: number;
  disabled: boolean;
  email?: string;
  customClaims: {
    isAdmin: boolean,
    isExpert: boolean
  };
  following: {[key:string] : {}};
  metadata?: {};
  phoneNumber?: string
  isAdmin?: boolean,
  isExpert?: boolean
}

export type Subscription = {
  id?: string,
  uid: string;
  eid: string;
  startDate: Date;
  endDate?: Date;
  perm: boolean;
  value: number;
}

export type Expert = {
  id: string;
  avatar: string;
  imageURL: string;
  name: string;
  followerNum: number;
  permPrice: number;
  monthlyPrice: number;
  selfIntro: string;
  shortInfo: string;
  status: ExpertStatus;
  preds?: Prediction[]
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

export const subscriptionConverter: FirestoreDataConverter<Subscription> = {
  toFirestore(sub: WithFieldValue<Subscription>): DocumentData {
    return {
      uid: sub.uid,
      eid: sub.eid,
      startDate: sub.startDate,
      value: sub.value,
      perm: sub.perm,
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
      startDate: data.startDate,
      perm: data.perm,
      value: data.value,
      endDate: data.endDate ?? undefined,
    };
  },
};

export const predConverter: FirestoreDataConverter<Prediction> = {
  toFirestore(pred: WithFieldValue<Prediction>): DocumentData {
    // const dateIntimeStamp = pred.dateIn as Timestamp
    // const dateIn = new Date(Number(dateIntimeStamp))
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
      dateIn: (data.dateIn as FirebaseFirestore.Timestamp).toDate(),
      priceIn: data.priceIn,
      priceOut: data.priceOut,
      cutLoss: data.cutLoss,
      deadLine: (data.deadLine as FirebaseFirestore.Timestamp).toDate(),
      dateRelease: data.dateRelease,
      priceRelease: data.priceRelease,
      id: snapshot.id,
      note: data.note,
      status: data.status,
      portion: data.portion
    };
  },
};

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
    return { 
      avatar: expert.avatar,
      imageURL: expert.imageURL, 
      name: expert.name, 
      shortInfo: expert.shortInfo,
      selfIntro: expert.selfIntro,
      followerNum: expert.followerNum,
      status: expert.status,
      permPrice: expert.permPrice, 
      monthlyPrice: expert.monthlyPrice,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): Expert {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      avatar: data.avatar,
      imageURL: data.imageURL,
      name: data.name,
      followerNum: data.followerNum,
      permPrice: data.permPrice,
      monthlyPrice: data.monthlyPrice,
      shortInfo: data.shortInfo,
      selfIntro: data.selfIntro,
      status:  ExpertStatus.activated,
    };
  },
};



export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      following: user.following,
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
      email: data.email,
      metadata: data.metadata,
      customClaims: data.customClaims,
      phoneNumber: data.phoneNumber,
      isAdmin: data.email == 'lxmhoang@gmail.com' ? true : data.isAdmin ?? false,
      isExpert: data.isExpert ?? false,
      following: data.following ?? []
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

export type APIResponse<T = object> = { success: true; data: T } | { success: false; error: string };