

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
import { Expert, Prediction, Subscription, Transaction, User, expertConverter, predConverter, subscriptionConverter, transConverter, userConverter } from "../definitions";
import { getAuth } from "firebase/auth";
import { getCurrentUser } from "../firebaseadmin/firebaseadmin";

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

export async function getAUserByID(id: string) {

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




export async function addNewPrediction(pred: Prediction, expertUid: string) {
	const predCollection = collection(db, 'expert/' + expertUid + '/preds')
	const docRef = await addDoc(predCollection, pred)
	const snapshot = await getDoc(docRef.withConverter(predConverter))
	return snapshot.data()

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
	});
}

export async function getPredsFromExpert(user: User | undefined, expert: Expert | undefined) {
	if (!expert || !user) { 
		return Promise.resolve([]) 
	}
	if (user) {
		const notSub = user.following[expert.id] == null 
		console.log(notSub ? 'not sub ' : 'already sub')
		let q = query(collection(db, 'expert', expert.id, 'preds').withConverter(predConverter))
		notSub ? q = query( q, where('status','==','Closed')) : q

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => doc.data())

	} else {
		return []
	}


}