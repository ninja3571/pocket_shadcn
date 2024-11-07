
import { useState, useEffect } from "react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import PocketBase from 'pocketbase';
import { Login } from "./login_form";

  const pb = new PocketBase('http://172.16.15.141:8080');

export default function UserAwatar({onlogin, user, setUser}){
    // const [user, setUser] = useState(null)

    useEffect(()=>{
        setUser(pb.authStore.model)
    },[])

    // const login = async ()=>{

    //     setUser(pb.authStore.model)
    // }

    const logout =()=>{
        pb.authStore.clear();
        setUser(null)

        console.log(pb.authStore);
    }

    return(
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={user && pb.files.getUrl(user, user.avatar)} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>{user ? user.username : 'Nie zalogowano'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ?
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>

          :
            <DropdownMenuItem asChild>
                <Login onLogin={onlogin}/>
            </DropdownMenuItem>
          }

        </DropdownMenuContent>
      </DropdownMenu>
    )
}