import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";

export type CustomerField = {
    id: string;
    name: string;
  };

  export type Expert = { 
    avatar: string;
    imageURL: string; 
    id: string; 
    name: string; 
    followerNum: number; 
    selfIntro: string; 
    shortInfo: string; 
    status: string;
  }

  export const postConverter: FirestoreDataConverter<Expert> = {
    toFirestore(post: WithFieldValue<Expert>): DocumentData {
      return { imageURL: post.imageURL, name: post.name, shortInfo: post.shortInfo };
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
  