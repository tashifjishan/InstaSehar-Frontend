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
import {io} from "socket.io-client";
export default function App(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser]= useState({});
  const [socket, setSocket] = useState(null);
  useEffect(()=>{
      (async ()=>{
        try {
          setLoading(true);
          let response = await fetch("http://localhost:8080/profile", {credentials: "include"});
          const ok = response.ok;
          response = await response.json();
          if(!ok) throw new Error(response.message);
          console.log(response);
          setUser(response.message);
          setLoggedIn(true);
          const socket = io("http://localhost:8080", {withCredentials: true});
          setSocket(socket);
        } catch (error) {
          setLoggedIn(false);
          console.log(error)
        }finally{
          setLoading(false);
        }
      })()

  }, []);

  
  return(
    <>
      {!loading && !loggedIn && <LoginPage />}
      {!loading && loggedIn && <MainPage user={user} socket={socket} />}
      {loading && <p>Loadin...</p>}
    </>
  )
}