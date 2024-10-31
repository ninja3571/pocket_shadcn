'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import PocketBase from 'pocketbase';
import { DialogClose } from "@radix-ui/react-dialog"
import Image from "next/image"

export default function EditItem({item, onupdated}){

    const [dane, setDane] = useState({marka: item.marka, model: item.model, czas_parkowania: item.czas_parkowania})
    const [zdjecie, setZdjecie] = useState(null)

    const pb = new PocketBase('http://172.16.15.141:8080');

    const handleInputChange = (id, e) =>{

        setDane((prev)=>({
          ...prev,
          [id]: e.target.value
      }))
      console.log(dane)
      }

    const handleZdjecie = (e) =>{
        console.log(e)
        setZdjecie(e.target.files[0])
      }

    const update = async ()=>{
        const formData = new FormData()

        formData.append("marka", dane.marka)
        formData.append("model", dane.model)
        formData.append("czas_parkowania", dane.czas_parkowania)
        formData.append('zdjecie', zdjecie)
        const record = await pb.collection('samochody').update(item.id, formData);


        onupdated(record)
    }

    return(
    <Dialog>
        <DialogTrigger>
            <Button><Pencil/></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor='marka'>Marka</Label>
                      <Input defaultValue={item.marka} onChange={(e)=>{handleInputChange('marka', e)}} type='text' id='marka' placeholder='Marka'></Input>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor='model'>Model</Label>
                      <Input defaultValue={item.model} onChange={(e)=>{handleInputChange('model', e)}} type='text' id='model' placeholder='Model'></Input>
                    </div>
                
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor='czas_parkowania'>Czas Parkowania</Label>
                      <Input defaultValue={item.czas_parkowania} onChange={(e)=>{handleInputChange('czas_parkowania', e)}} type='number' id='czas_parkowania' placeholder='Czas parkowania'></Input>
                    </div>
                
                    <div className="w-[150px] h-[75px] relative">
                        <Image
                        src={pb.files.getUrl(item, item.zdjecie)}
                        alt={item.model}
                        fill={true}/>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor='zdjecie'>Zdjecie</Label>
                      <Input onChange={(e)=>{handleZdjecie(e)}} type='file' id='zdjecie' placeholder='Zdjecie'></Input>
                    </div>

                    <DialogClose asChild>
                        <Button onClick={update}>Save changes</Button>
                    </DialogClose>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
    )
}