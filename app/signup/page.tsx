"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputBox from "@/components/InputBox";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="text-white w-screen h-screen flex justify-center items-center">
      <div className="w-full md:w-1/3 bg-white/10 flex flex-col items-center py-3 rounded-lg px-10">
        <div className="text-3xl font-bold mb-2">Sign Up</div>
        <div className="text-xs text-white/50 mb-3">
          Already have an accout?{" "}
          <a className="underline hover:text-white" href="/signup">
            Login.
          </a>
        </div>
        <InputBox
          key={"name"}
          type="text"
          placeholder="John Stark"
          label="Name"
          setValue={setName}
        />
        <InputBox
          key={"email"}
          type={"email"}
          placeholder="john@abc.com"
          label="Email"
          setValue={setEmail}
        />
        <InputBox
          key={"password"}
          type="password"
          placeholder="password"
          label="Password"
          setValue={setPassowrd}
        />
        <button
          onClick={async () => {
            const chk = await signIn("credentials", {
              email: email,
              password: password,
              name: name,
              redirect: false,
            });
            if (chk?.ok) router.push("/");
          }}
          className="mt-3 py-1 w-full bg-black rounded-md hover:border hover:border-blue-500 mb-6"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
