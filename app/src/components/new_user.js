import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react";
import { Button } from "./ui/button";


import PocketBase from 'pocketbase';

const pb = new PocketBase('http://172.16.15.141:8080');
export default function New_user({setOpen}){
    const [user, setUser] = useState(null)
    const [pass1, setPass1] = useState(null)
    const [pass2, setPass2] = useState(null)
    const [error, setError] = useState(false)
    const [zdjecie, setZdjecie] = useState(null)

    const handleUser = (e)=>{
        setUser(e.target.value)
    }

    const handlePass1 = (e)=>{
        setPass1(e.target.value)
    }

    const handlePass2 = (e)=>{
        setPass2(e.target.value)
    }

    const handleZdjecie = (e)=>{
        setZdjecie(e.target.files[0])
    }

    
    const handleButton = async()=>{
        console.log(user)
        console.log(pass1)
        console.log(pass2)

        const formData = new FormData()
        formData.append('username', user)
        formData.append('password', pass1)
        formData.append('passwordConfirm', pass2)
        {zdjecie ? formData.append('avatar', zdjecie) : null}
        
        try{
            const record = await pb.collection('users').create(formData);
            console.log(record)
            setOpen()
        } catch(err){
            setError(true)
            console.log(err)
        }

        // onLogin()
    }

    return(
        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Username
          </Label>
          <Input
            onChange={(e)=>{
                handleUser(e)
            }} 
            id="name"
            defaultValue=""
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password1" className="text-right">
            Password
          </Label>
          <Input
            onChange={(e)=>{
                handlePass1(e)
            }} 
            id="password1"
            type='password'
            defaultValue=""
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password2" className="text-right">
            Password
          </Label>
          <Input
            onChange={(e)=>{
                handlePass2(e)
            }} 
            id="password2"
            type='password'
            defaultValue=""
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password2" className="text-right">
            Password
          </Label>
          <Input
            onChange={(e)=>{
                handleZdjecie(e)
            }} 
            id="password2"
            type='file'
            defaultValue=""
            className="col-span-3"
          />
        </div>
        {/* {error && <p className="text-red-600">Nie udało się zalogowac</p>} */}
        <Button onClick={handleButton}>Zaloguj</Button>
      </div>
    )
}