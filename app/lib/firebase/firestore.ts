

import {
	collection,
	onSnapshot,
	query,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	orderBy,
	Timestamp,
	runTransaction,
	where,
	addDoc,
	DocumentData,
	DocumentReference,
	Firestore,
	Query,
	FirestoreDataConverter,
	writeBatch,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase/firebase";
import { Transaction, expertConverter, transConverter, userConverter } from "../definitions";

function applyQueryFilters(q: Query<DocumentData, DocumentData>, params:{[key:string]:string}) {
	if (params.visible != undefined) {
		q = query(q, where("visible", "==", params.visible));
	}
	if (params.id) {
		q = query(q, where("id", "==", params.id));
	}
	if (params.price) {
		q = query(q, where("price", "==", params.price));
	}
	if (params.paymentId) {
		q = query(q, where("paymentId", "==", params.paymentId));
	}
	if (params.status) {
		q = query(q, where("status", "==", params.status));
	}
	if (params.uid) {
		q = query(q, where("uid", "==", params.uid));
	}
	
	
	return q;
}

export async function getAnExpertById(id: string) {

	const docRef = doc(db, "expert", id);
	try {
		
	}
	catch (error) {
		
	}
	const docSnap = await getDoc(docRef)
	var articles : {
		stockCode: string,
		cutLossPrice: number, 
		exitPrice: number,
		inPrice: number,
		finalPrice: number,
		inDate: Timestamp,
		avatar: string
	
	} [] = []

	if (docSnap.data()?.arrayArticle != null) {
		// console.log("bbb"+docSnap.data()?.arrayArticle?.[0]?.stockCode);
		 articles  = docSnap.data()?.arrayArticle?.map ((article : {
			stockCode: string,
			cutLossPrice: number, 
			exitPrice: number,
			inPrice: number,
			finalPrice: number,
			inDate: Timestamp
		
		}  ) => {
			return {
				stockCode : article.stockCode,
				cutLossPrice : article.cutLossPrice,
				exitPrice : article.exitPrice,
				inPrice : article.inPrice,
				finalPrice : article.finalPrice,
				inDate : article.inDate,
			}
			
		})
	
		console.log("vvvv" + articles)
	} else {

	}
	return {
		id: docSnap.id,
		imageURL: docSnap.data()?.imageURL,
		followerNum: docSnap.data()?.followerNum,
		name: docSnap.data()?.name,
		avatar: docSnap.data()?.avatar,
		selfIntro: docSnap.data()?.selfIntro,
		shortInfo: docSnap.data()?.shortInfo,
		articles: articles

		// ...docSnap.data(),s
		// timestamp: docSnap.data().timestamp.toDate(),
	};

}

export async function addANewTransaction(tran: Transaction) {
	const tranCollection = collection(db, 'transaction')
	const docRef = await addDoc(tranCollection, tran)
	const snapshot = await getDoc(docRef.withConverter(transConverter))
	return snapshot.data()
}

export async function searchCollection<ModelType>(name: string, filters = {},converter: FirestoreDataConverter<ModelType>) {
	let q = query(collection(db, name));
	q = applyQueryFilters(q, filters)
	const result = await getDocs(q.withConverter(converter))
	return result.docs.map(doc => {
		return doc.data()
	})
}

export async function approvePendingTrans(tranIDs: string[]) {
	const batch = writeBatch(db)
	tranIDs.forEach( (id) => {
		const docRef = doc(db, 'transaction', id)
		batch.update(docRef, {status: "adminApproved"})
	})
	await batch.commit()
}

export async function searchUser(filters = {}) {
	let q = query(collection(db, "user"));
	

	q = applyQueryFilters(q, filters)
	const results = await getDocs(q.withConverter(userConverter));
	return results.docs.map(doc => {

		return doc.data()
		
	});

}

export async function getExperts(filters = {}) {
	let q = query(collection(db, "expert"));
	

	q = applyQueryFilters(q, filters);
	const results = await getDocs(q);
	return results.docs.map(doc => {
		return {
			id: doc.id,
			imageURL: doc.data().imageURL,
			followerNum: doc.data().followerNum,
			name: doc.data().name,
			selfIntro: doc.data().selfIntro,
			shortInfo: doc.data().shortInfo,

			// ...doc.data()//,
			// Only plain objects can be passed to Client Components from Server Components
			// timestamp: doc.data().timestamp.toDate(),
		};
	});
}