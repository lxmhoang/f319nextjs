'use client'
import { useAppContext } from "@/app/lib/context";
import { db } from "@/app/lib/firebase/firebase";
import { expertConverter } from "@/app/model/expert";
import { FormEditExpert } from "@/app/ui/profile/form-edit-expert";
import { doc } from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";


export default function Page() {
    const { user } = useAppContext()
    console.log("user uid" + user?.uid)
    const [userExpertInfo, loading, error] = useDocumentDataOnce(
        doc(db, 'expert', user?.uid ?? "dd").withConverter(expertConverter));


    return (
        <div>
            <div>{user?.displayName}</div>
            {userExpertInfo && user ? (
                <FormEditExpert userInfo={user} expert={userExpertInfo} />

            ) : (
                <></>
            )}
        </div>

    )
}
