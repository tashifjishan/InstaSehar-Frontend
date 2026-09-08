// import { createBrowserRouter, RouterProvider } from "react-router";
// import AuthPages from "./Components/Pages/Auth";
// import FeedPage from "./Components/Pages/Home";
// import MessagesPage from "./Components/Pages/Messages";
// import ProfilePage from "./Components/Pages/Profile";
// import SearchPage from "./Components/Pages/Search";

import { useEffect, useState } from "react"
import LoginPage from "./Components/Pages/Login"
import MainPage from "./Components/Pages/MainPage"

// export default function App(){

//   const router = createBrowserRouter([
//     {path: "/", element: <FeedPage />},
//     {path: "/inbox", element: <MessagesPage />},
//     {path: "/profile", element: <ProfilePage />},
//     {path: "/search", element: <SearchPage />},
//   ])

//   return (
//     <RouterProvider router={router} />
//   )
// }

export default function App(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
      (async ()=>{
        try {
          setLoading(true);
          let response = await fetch("http://localhost:8080/profile", {credentials: "include"});
          const ok = response.ok;
          response = await response.json();
          if(!ok) throw new Error(response.message);
          console.log(response);
          setLoggedIn(true);
        } catch (error) {
          setLoggedIn(false);
          console.log(error)
        }finally{
          setLoading(false);
        }
      })()

  }, [])
  return(
    <>
      {!loading && !loggedIn && <LoginPage />}
      {!loading && loggedIn && <MainPage />}
      {loading && <p>Loadin...</p>}
    </>
  )
}