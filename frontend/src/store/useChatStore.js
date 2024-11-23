import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"


export const useChatStore=create((set,get)=>({
   messages:[],
   users:[],
   selectedUser:null  ,
   isUsersLoading:false,
   isMessagesLoading:false,
   
   
   getUsers:async()=>{
    set({isUsersLoading:true})
    try {
     const res= await axiosInstance.get("/messages/users")
     set({users:res.data})
    } catch (error) {
        console.log("error in getUsers")
        toast.error(error.message)
    }finally{
        set({isUsersLoading:false})
       }

   },
   getMessages:async(userId)=>{
    set({isMessagesLoading:true})
    try {
     const res= await axiosInstance.get(`/messages/${userId}`)
     set({messages:res.data})
    } catch (error) {
        console.log("error in getMessages")
        toast.error(error.message)
    }finally{
        set({isMessagesLoading:false})
       }

   },
   sendMessage:async(messageData)=>{
   
    try {
        const {selectedUser,messages}=get()
     const res= await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
     set({messages:[...messages,res.data]})
    } catch (error) {
        console.log("error in sendMessage")
        toast.error(error.message)
    }

   },
   subscribeToMessages:()=>{
    const {selectedUser}=get()
    if(!selectedUser)return;
    const socket=useAuthStore.getState().socket;
    socket.on("newMessage",(newMessage)=>{
        if(newMessage.senderId!==selectedUser._id)return;
        set({messages:[...get().messages,newMessage]})
    })
   } ,

   unsubscribeFromMessages:()=>{
    const socket=useAuthStore.getState().socket;
    socket.off("newMessage")
   } ,

   setSelectedUser:(selectedUser)=>set({selectedUser})

}))