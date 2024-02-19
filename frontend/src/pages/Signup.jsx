import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios'
export const Signup = () => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [lastname,setLastname] = useState("");
    const [firstname,setFirstname] = useState("");
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={e => {
          setFirstname(e.target.value);
        }} placeholder="John" label={"First Name"} />
        <InputBox onChange={e => {
          setLastname(e.target.value);
        }} placeholder="Doe" label={"Last Name"} />
        <InputBox onChange={e => {
          setUsername(e.target.value);
        }} placeholder="abc@gmail.com" label={"Email"} />
        <InputBox onChange={e => {
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async ()=>{
            const res = await axios.post("http://localhost:3000/api/v1/user/signup",{
              username,
              password,
              firstname,
              lastname
            });
            localStorage.setItem("token",res.data.token);
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}