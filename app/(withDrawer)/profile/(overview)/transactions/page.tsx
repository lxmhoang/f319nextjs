
// import { getMyTransHistory } from "@/app/lib/server";
import MyTransView from "@/app/ui/profile/my-trans-view";


export default async function Page() {

  return (<div>
    
      <MyTransView />
  </div>
  )

  // const trans = await getMyTransHistory()
  // const userInfo = await getUserInfoFromSession()


  // return (
  //   <div>
  //     {
  //     userInfo && trans.length > 0 ? ( <MyTransView  />) : 
  //       userInfo ? (<>Chưa có giao dịch nào </>) : (<>Chưa đăng nhập</>)
  //     }


  //   </div>
  // )

}