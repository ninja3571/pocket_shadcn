'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Timer } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Delete from "@/components/deleteItem";
import EditItem from "@/components/editItem";


const pb = new PocketBase('http://172.16.15.141:8080');



export default function Home() {
  const [samochody, setSamochody] = useState(null)
  const [dane, setDane] = useState({marka:null, model: null, czas_parkowania:null})
  const [zdjecie, setZdjecie] = useState(null)
  
  useEffect(()=>{
    const getData = async ()=>{
      try{
        const records = await pb.collection('samochody').getFullList({
          sort: '-created',
      });
      console.log(records)
      setSamochody(records)

      } catch(error){
        console.log(error)
      } finally{

      }
    }
    getData()
  }, [])

  const handleInputChange = (id, e) =>{

    setDane((prev)=>({
      ...prev,
      [id]: e.target.value
  }))
  console.log(dane)
  }

  const handleSubmit =async ()=>{
    const formData = new FormData()

    formData.append("marka", dane.marka)
    formData.append("model", dane.model)
    formData.append("czas_parkowania", dane.czas_parkowania)
    formData.append('zdjecie', zdjecie)

    try{
      const record = await pb.collection('samochody').create(formData);
      setSamochody((prev)=>([
        ...prev,
        record
      ]))
    } catch(err){

    }
  }

  const handleZdjecie = (e) =>{
    console.log(e)
    setZdjecie(e.target.files[0])
  }

  const deleted = (id)=>{
    setSamochody((prev)=>(
      prev.filter((ele)=>{
        return ele.id != id
      })
    ))
  }

  const updated = (item)=>{
    console.log(item)

      var index = null
      var tmpSamochody = [...samochody]
      for(let i in samochody){
        if(samochody[i].id == item.id){
          index = i
        }
      }
      tmpSamochody[index] == item
      setSamochody(tmpSamochody)
      console.log("index: " + index)
    
  }

  return (
    <div>
      <h1>Pocketbase</h1>

      <div className="flex justify-center w-full flex-wrap gap-5">

      
      {samochody &&
        samochody.map((samochod)=>(
          
        <Card className='w-[400px]' key={samochod.id}>
          <CardTitle>{samochod.marka}</CardTitle>
          <CardDescription>{samochod.model}</CardDescription>
          <CardContent>
            <Image
            src={pb.files.getUrl(samochod, samochod.zdjecie)}
            alt={samochod.zdjecie}
            width={500}
            height={500}
            className="rounded-md"
            />
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-center">
              <div>
                <Delete id={samochod.id}
                ondeleted={deleted}/>
              </div>
              <div>
                <EditItem item={samochod}
                onupdated={updated}/>
              </div>
              <div className="flex justify-end w-full">
                <Timer/>
                <p>Czas parkowania: {samochod.czas_parkowania}</p>
              </div>
            </div>
          </CardFooter>
        </Card>
          
        ))
      }
      </div>

      <div className="mt-5 flex flex-col items-center flex-wrap gap-5">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor='marka'>Marka</Label>
          <Input onChange={(e)=>{handleInputChange('marka', e)}} type='text' id='marka' placeholder='Marka'></Input>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor='model'>Model</Label>
          <Input onChange={(e)=>{handleInputChange('model', e)}} type='text' id='model' placeholder='Model'></Input>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor='czas_parkowania'>Czas Parkowania</Label>
          <Input onChange={(e)=>{handleInputChange('czas_parkowania', e)}} type='number' id='czas_parkowania' placeholder='Czas parkowania'></Input>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor='zdjecie'>Zdjecie</Label>
          <Input onChange={(e)=>{handleZdjecie(e)}} type='file' id='zdjecie' placeholder='Zdjecie'></Input>
        </div>

        <Button onClick={handleSubmit}>Dodaj</Button>
      </div>

    </div>
  );
}
