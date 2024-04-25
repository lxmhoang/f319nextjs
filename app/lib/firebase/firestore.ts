

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

import { auth, db } from "@/app/lib/firebase/firebase";
import { Prediction, Subscription, Transaction, expertConverter, predConverter, subscriptionConverter, transConverter, userConverter } from "../definitions";
import { getAuth } from "firebase/auth";

function applyQueryFilters(q: Query<DocumentData, DocumentData>, params: { [key: string]: string }) {
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

async function getAUserByID(id: string) {

	const docRef = doc(db, "user", id).withConverter(userConverter);

	const docSnap = await getDoc(docRef)
	var user = docSnap.data()
	return user
}

async function getAnExpertById(id: string) {

	const docRef = doc(db, "expert", id).withConverter(expertConverter);

	const docSnap = await getDoc(docRef)
	var expert = docSnap.data()
	if (expert) {
		const predRef = collection(db, "expert", id, "preds").withConverter(predConverter)

		let preds = (await getDocs(predRef)).docs.map(doc => doc.data())
		expert.preds = preds
	}

	return expert
}

async function getActivesubscriptionOf(uid: string, eid: string) {
	let q = query(collection(db, "subscription"), where("eid", "==", eid), where("uid", "==", uid), where("isExpired", "==", false));


	const results = await getDocs(q.withConverter(predConverter));
	return results.docs.map(doc => {
		return doc.data()
	});

}

export async function subcribleToAnExpert(eid: string, length: number) {

	if (auth.currentUser == null) {
		return Promise.resolve({
			success: false,
			error: "not authorized"
		})
	}
	const user = await getAUserByID(auth.currentUser.uid)
	if (user == undefined || user.amount < 500000) {
		return Promise.resolve({
			success: false,
			error: "khong du tien"
		})
	}

	const expertToSub = await getAnExpertById(eid)

	if (expertToSub == undefined) {
		return Promise.resolve({
			success: false,
			error: "khong tim thay expert"
		})
	}

	if (expertToSub.id == user.uid) {
		return Promise.resolve({
			success: false,
			error: "user va expert la chung 1 nguoi"
		})

	}

	const existingSub = await getActivesubscriptionOf(user.uid, eid)
	if (existingSub.length > 0) {
		return Promise.resolve({
			success: false,
			error: "Subscription da ton tai"
		})

	}

	const tran: Transaction = {
		tranType: "subTran",
		toUid: expertToSub.id,
		fromUid: user.uid,
		amount: 500000,
		status: "Done"
	}

	const result = await addANewTransaction(tran)
	if (result.success == false) {
		return Promise.resolve({
			success: false,
			error: result.message
		})
	}


	const subCollection = collection(db, 'subscription/').withConverter(subscriptionConverter)
	if (user) {
		const newSub: Subscription = {
			uid: user.uid,
			eid: eid,
			startDate: new Date(),
			length: length,
			isExpired: false,
			value: 500000
		}
		console.log('adding new sub' + JSON.stringify(newSub))
		const subDocRef = await addDoc(subCollection, newSub)

		return {
			success: true,
			error: ""
		}
	} else {
		return {
			error: "unauthorized",
			success: false
		}
	}


}

export async function addNewPrediction(pred: Prediction, expertUid: string) {
	const predCollection = collection(db, 'expert/' + expertUid + '/preds')
	const docRef = await addDoc(predCollection, pred)
	const snapshot = await getDoc(docRef.withConverter(predConverter))
	return snapshot.data()

}

export async function addANewTransaction(tran: Transaction) {
	const tranCollection = collection(db, 'transaction')
	try {
		const docRef = await addDoc(tranCollection, tran)
		return {
			success: true,
			error: null,
			message: docRef.path
		}

		docRef.path
	} catch (e) {
		return {
			success: false,
			error: e,
			message: 'something wrong adding transaction'
		}
	}
}

export async function searchCollection<ModelType>(name: string, filters = {}, converter: FirestoreDataConverter<ModelType>) {
	let q = query(collection(db, name));
	q = applyQueryFilters(q, filters)
	const result = await getDocs(q.withConverter(converter))
	return result.docs.map(doc => {
		return doc.data()
	})
}

export async function approvePendingTrans(tranIDs: string[]) {
	const batch = writeBatch(db)
	tranIDs.forEach((id) => {
		const docRef = doc(db, 'transaction', id)
		batch.update(docRef, { status: "adminApproved" })
	})
	await batch.commit()
}

export async function updateRefID(userDocID: string, refID: string) {
	let docRef = doc(db, 'user/' + userDocID)
	return updateDoc(docRef, { refID: refID })
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


	const expertQuery = applyQueryFilters(q, filters).withConverter(expertConverter);

	const results = await getDocs(expertQuery);
	return results.docs.map(doc => {
		return doc.data()
		// return {
		// 	id: doc.id,
		// 	imageURL: doc.data().imageURL,
		// 	followerNum: doc.data().followerNum,
		// 	name: doc.data().name,
		// 	selfIntro: doc.data().selfIntro,
		// 	shortInfo: doc.data().shortInfo,

		// 	// ...doc.data()//,
		// 	// Only plain objects can be passed to Client Components from Server Components
		// 	// timestamp: doc.data().timestamp.toDate(),
		// };
	});
}