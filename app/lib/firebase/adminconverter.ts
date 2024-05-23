import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase-admin/firestore";
import { Expert, Prediction, Subscription, Transaction, User } from "../definitions";


export const userAdminConverter: FirestoreDataConverter<User> = {
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
      snapshot: QueryDocumentSnapshot
    ): User {
      const data = snapshot.data();
      return {
        uid: snapshot.id,
        accessId: data.accessId,
        displayName: data.displayName,
        amount: data.amount,
        disabled: data.disabled,
        email: data.email,
        following: data.following ?? {},
        metadata: data.metadata,
        customClaims: data.customClaims,
        phoneNumber: data.phoneNumber,
        isExpert: data.isExpert  
      };
    },
  };

export const expertAdminConverter: FirestoreDataConverter<Expert> = {
    toFirestore(expert: WithFieldValue<Expert>): DocumentData {
      return { 
        avatar: expert.avatar,
        imageURL: expert.imageURL, 
        name: expert.name, 
        shortInfo: expert.shortInfo,
        selfIntro: expert.selfIntro,
        follower: expert.follower,
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
        follower: data.follower,
        permPrice: data.permPrice,
        monthlyPrice: data.monthlyPrice,
        shortInfo: data.shortInfo,
        selfIntro: data.selfIntro,
        status: data.status,
        halfYear: data.halfYear,
        oneYear: data.oneYear,
        twoYear: data.twoYear
      };
    },
  };


export const predAdminConverter: FirestoreDataConverter<Prediction> = {
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
        note: pred.note,
        status: pred.status,
        portion: pred.portion
      };
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
    ): Prediction {
      const data = snapshot.data();
      const dateRelease = data.dateRelease ?  (data.dateRelease as FirebaseFirestore.Timestamp).toDate() : undefined
      return {
        assetName: data.assetName,
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

  export const subscriptionAdminConverter: FirestoreDataConverter<Subscription> = {
    toFirestore(sub: WithFieldValue<Subscription>): DocumentData {

      return {
        uid: sub.uid,
        eid: sub.eid,
        startDate: sub.startDate,
        value: Number(sub.value),
        perm: sub.perm
      } 
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot
    ): Subscription {
      const data = snapshot.data();
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



export const adminTranConverter: FirestoreDataConverter<Transaction> = {
    toFirestore(trans: WithFieldValue<Transaction>): DocumentData {
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
      snapshot: QueryDocumentSnapshot,
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