'use client'

import TransCreationForm from "@/app/ui/profile/create-trans-form";
import { useFormState } from "react-dom";
import { searchUserForPayment } from "@/app/lib/action";
import SearchUserForm from "@/app/ui/profile/search-user-form";

export default function Home() {

  const initialState = { message: "", errors: {} };
  const [searchState, dispatchSearch] = useFormState(searchUserForPayment, initialState);

    return    (
<>  
      {/* <div>{JSON.stringify(role)}</div>
      <div>{JSON.stringify(user)}</div> */}
      <SearchUserForm state={searchState} dispatch={dispatchSearch} fields={[
        {
           name:'paymentId', placeHolder: 'Nhap payment id', type:'search'
        },
        {
           name:'displayName', placeHolder: 'displayName', type:'search'
        }


      ]} />
      { searchState.user ? (
        <TransCreationForm user={JSON.parse(searchState.user)} transactionType="deposit" />
      ) : (<>Search user</>) }
    
      </>
    );

}
