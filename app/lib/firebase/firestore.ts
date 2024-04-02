import { generateFakeRestaurantsAndReviews } from "@/app/lib/fakeRestaurants.js";

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
	Transaction,
	Firestore,
	Query,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase/firebase";

export async function updateRestaurantImageReference(
	restaurantId: string | undefined,
	publicImageUrl: any
) {
	const restaurantRef = doc(collection(db, "restaurants"), restaurantId);
	if (restaurantRef) {
		await updateDoc(restaurantRef, { photo: publicImageUrl });
	}
}

const updateWithRating = async (
	transaction: Transaction,
	docRef: DocumentReference<DocumentData, DocumentData>,
	newRatingDocument: DocumentReference<DocumentData, DocumentData>,
	review: { rating: any; }
) => {
	const restaurant = await transaction.get(docRef);
	const data = restaurant.data();
	const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
	const newSumRating = (data?.sumRating || 0) + Number(review.rating);
	const newAverage = newSumRating / newNumRatings;

	transaction.update(docRef, {
		numRatings: newNumRatings,
		sumRating: newSumRating,
		avgRating: newAverage,
	});

	transaction.set(newRatingDocument, {
		...review,
		timestamp: Timestamp.fromDate(new Date()),
	});
};

export async function addReviewToRestaurant(db: Firestore, restaurantId: string | undefined, review: { rating: any; }) {
	if (!restaurantId) {
		throw new Error("No restaurant ID has been provided.");
	}

	if (!review) {
		throw new Error("A valid review has not been provided.");
	}

	try {
		const docRef = doc(collection(db, "restaurants"), restaurantId);
		const newRatingDocument = doc(
			collection(db, `restaurants/${restaurantId}/ratings`)
		);

		// corrected line
		await runTransaction(db, transaction =>
			updateWithRating(transaction, docRef, newRatingDocument, review)
		);
	} catch (error) {
		console.error(
			"There was an error adding the rating to the restaurant",
			error
		);
		throw error;
	}
}

function applyQueryFilters(q: Query<DocumentData, DocumentData>, params:any) {
	if (params.visible != undefined) {
		q = query(q, where("visible", "==", params.visible));
	}
	if (params.id) {
		q = query(q, where("id", "==", params.id));
	}
	if (params.price) {
		q = query(q, where("price", "==", params.price));
	}
	// if (params.sort === "Rating" || !params.sort) {
	// 	q = query(q, orderBy("avgRating", "desc"));
	// } else if (params.sort === "Review") {
	// 	q = query(q, orderBy("numRatings", "desc"));
	// }
	return q;
}

export async function getAnExpertById(id: string) {

	const docRef = doc(db, "expert", id);
	try {
		
	}
	catch (error) {
		
	}
	const docSnap = await getDoc(docRef)
	if (docSnap.data()?.arrayArticle?.[0]?.stockCode) {
		console.log("bbb"+docSnap.data()?.arrayArticle?.[0]?.stockCode);
	}
	const articles : {
		stockCode: string,
		cutLossPrice: number, 
		exitPrice: number,
		inPrice: number,
		finalPrice: number,
		inDate: Timestamp
	
	} [] = docSnap.data()?.arrayArticle?.map ((article : {
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
	// console.log("bbb"+docSnap.data()?.arrayArticle?.[0]?.stockCode);
	// const 
	return {
		id: docSnap.id,
		imageURL: docSnap.data()?.imageURL,
		followerNum: docSnap.data()?.followerNum,
		name: docSnap.data()?.name,
		selfIntro: docSnap.data()?.selfIntro,
		shortInfo: docSnap.data()?.shortInfo,
		articles: articles
		// ...docSnap.data(),s
		// timestamp: docSnap.data().timestamp.toDate(),
	};

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

export async function getRestaurants(filters = {}) {
	let q = query(collection(db, "plans"));

	q = applyQueryFilters(q, filters);
	const results = await getDocs(q);
	return results.docs.map(doc => {
		return {
			id: doc.id,
			...doc.data(),
			// Only plain objects can be passed to Client Components from Server Components
			timestamp: doc.data().timestamp.toDate(),
		};
	});
}

// export function getRestaurantsSnapshot(cb, filters = {}) {
// 	if (typeof cb !== "function") {
// 		console.log("Error: The callback parameter is not a function");
// 		return;
// 	}

// 	let q = query(collection(db, "restaurants"));
// 	q = applyQueryFilters(q, filters);

// 	const unsubscribe = onSnapshot(q, querySnapshot => {
// 		const results = querySnapshot.docs.map(doc => {
// 			return {
// 				id: doc.id,
// 				...doc.data(),
// 				// Only plain objects can be passed to Client Components from Server Components
// 				timestamp: doc.data().timestamp.toDate(),
// 			};
// 		});

// 		cb(results);
// 	});

// 	return unsubscribe;
// }

