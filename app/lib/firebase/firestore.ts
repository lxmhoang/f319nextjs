'use server'
'serve-only'

import {
	collection,
	query,
	getDocs,
	doc,
	updateDoc,
	where,
	DocumentData,
	Query,
	FirestoreDataConverter,
	getDocFromServer,
	or,
	setDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { expertConverter } from "@/app/model/expert";
import { transConverter } from "@/app/model/transaction";
// import { adminDB, test } from "../firebaseadmin/firebaseadmin";




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
	if (params.accessId) {
		q = query(q, where("accessId", "==", params.accessId));
	}
	if (params.status) {
		q = query(q, where("status", "==", params.status));
	}
	if (params.uid) {
		q = query(q, where("uid", "==", params.uid));
	}

	return q;
}


export async function clientSearchCollection<ModelType>(name: string, filters = {}, converter: FirestoreDataConverter<ModelType>) {
	let q = query(collection(db, name));
	q = applyQueryFilters(q, filters)
	const result = await getDocs(q.withConverter(converter))
	return result.docs.map(doc => {
		return doc.data()
	})
}

export async function clientSetDoc<ModelType>(path: string, data: ModelType,converter: FirestoreDataConverter<ModelType>) {
	await setDoc( doc(db, path).withConverter(converter), data)
}



export async function clientFetchObject<ModelType>(path: string, converter: FirestoreDataConverter<ModelType>) {
	const docRef = doc(db, path).withConverter(converter)
	const snap = await getDocFromServer(docRef)
	return snap.data()
}



// export async function updateRefID(userDocID: string, refID: string) {
// 	let docRef = doc(db, 'user/' + userDocID)
// 	return updateDoc(docRef, { refID: refID })
// }

export async function getMyTransHistory(uid: string) {
	// const user = await getCurrentUser()
	if (uid) {
		console.log('uid ' + uid)
		let q = collection(db, 'user/' + uid + '/trans').withConverter(transConverter)
		const querySnapshot = await getDocs(q)
		return querySnapshot.docs.map((doc) => doc.data())
	} else {
		console.log('not usr')
		return []
	}

}