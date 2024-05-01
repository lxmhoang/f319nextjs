
// "use client";
// // import { redirect, useRouter } from "next/navigation";
// import { useRouter } from 'next/navigation'
// import { auth } from "@/app/lib/firebase/firebase";
// import { User } from "firebase/auth";
// import { redirect } from "next/navigation";
// import { JSX, useEffect, useState } from "react";

// const withAuth = (Component:({children, user}: {children: React.ReactNode, user:User}) => JSX.Element) => {
//   const AuthenticatedComponent = (props: JSX.IntrinsicAttributes) => {
//     const [user, setUser] = useState<User>();

//     const router = useRouter()
//     useEffect(() => {
//       const unsubscribe = auth.onAuthStateChanged((user) => {
//         if (user) {
//           setUser(user);
//         } else {
//           // redirect("/")
//           router.push('/');
//         }
//       });

//       return unsubscribe;
//     }, []);

//     if (user) {
//       return <Component user={user} {...props}/>;
//     }

//     return null;
//   };

//   return AuthenticatedComponent;
// };

// export default withAuth;

// // export default function withAuth(Component:() => JSX.Element) {
// //   return function WithAuth(props: JSX.IntrinsicAttributes) {

// //     const [user, loadingAuthState, errorAuthState] = useAuthState(auth)
// //     // const router = useRouter()

// //     if (loadingAuthState == true) {
// //       return (<div>loading</div>)
// //     }

// //     if (loadingAuthState == false && errorAuthState == null) {
// //       if (!user) {
// //         return (<div>Please Login</div>)
// //       } else {
// //         return <Component {...props} ={user}/>;
// //       }
// //     } 


// //   };
// // }
