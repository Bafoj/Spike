import { getRepository } from "typeorm";
import { Message } from '../entity/message';

export const addMessage= async(message:string)=>{
    const newMessage = await getRepository(Message).create({ content: message } as Message);
    return await getRepository(Message).save(newMessage);
}


export const getMessages =async ()=>{
    return  await getRepository(Message).find()
}