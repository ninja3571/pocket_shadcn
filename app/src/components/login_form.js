import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "@radix-ui/react-label"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import New_user from "./new_user"

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://172.16.15.141:8080');
export function Login(onLogin) {

    const [user, setUser] = useState(null)
    const [pass, setPass] = useState(null)
    const [error, setError] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(()=>{
        setError(false)
    },[open])

    const handleUser = (e)=>{
        setUser(e.target.value)
    }

    const handlePass = (e)=>{
        setPass(e.target.value)
    }

    const handleButton = async()=>{
        console.log(user)
        console.log(pass)

        try{
            const authData = await pb.collection('users').authWithPassword(
                user,
                pass,
            );
        } catch(err){
            setError(true)
        }

        onLogin()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Logowanie</TabsTrigger>
              <TabsTrigger value="newAccount">Rejestracja</TabsTrigger>
            </TabsList>

              <TabsContent value="account">
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
                  <Label htmlFor="username" className="text-right">
                    Password
                  </Label>
                  <Input
                    onChange={(e)=>{
                        handlePass(e)
                    }} 
                    id="username"
                    type='password'
                    defaultValue=""
                    className="col-span-3"
                  />
                </div>
                {error && <p className="text-red-600">Nie udało się zalogowac</p>}
                <Button onClick={handleButton}>Zaloguj</Button>
              </div>
            </TabsContent>

            <TabsContent value="newAccount">
                  <New_user setOpen={setOpen}/>
            </TabsContent>
          </Tabs>

        </DialogContent>
      </Dialog>
    )
  }