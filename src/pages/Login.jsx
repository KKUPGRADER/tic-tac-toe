import ActionBar from "../components/ActionBar";
import Heading from "../components/Heading"
import { Input, FormElement, Label } from "../components/form-elements";
import Button from "../components/Button";
import ButtonContainer from "../components/ButtonContainer";
import Alert from "../components/Alert";
import Link from "next/link";

import axios from "axios";
// Firebase
import { firebaseApp } from "../libs/firebaseConfig"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";




export default function Login() {

    const [user, setUser] = useState({ email: "", password: "", username: "", });
    // const [currentUser, setCurrentUser] = useState({})

    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(user)
        SignInUser(user)
    }

    useEffect(() => {
        const uid = JSON.parse(localStorage.getItem("tic-tac-toe-user"));
        const CheckId = async (uid) => {
            await axios.post('/api/auth/uid', {
                uid: uid,
            }).then((response) => {
                console.log(response.data.body);
                if (response.data.body.isValid)
                    router.push("/game")

            }).catch((error) => {
                console.log(error);
                return {
                    error: error
                }
            });
        }
        console.log(CheckId(uid));


        CheckId(uid)

    }, [router])

    return (<>
        <ActionBar>
            <Link href="/">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_2667_249)">
                        <path d="M16.62 2.99C16.13 2.5 15.34 2.5 14.85 2.99L6.54 11.3C6.15 11.69 6.15 12.32 6.54 12.71L14.85 21.02C15.34 21.51 16.13 21.51 16.62 21.02C17.11 20.53 17.11 19.74 16.62 19.25L9.38 12L16.63 4.75C17.11 4.27 17.11 3.47 16.62 2.99Z" fill="#333333" />
                    </g>
                    <defs>
                        <clipPath id="clip0_2667_249">
                            <rect width={24} height={24} fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </Link>
            <Link href="/logout">
                <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z" /><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </Link>
        </ActionBar>
        <Heading>{" Please enter your \n details"}</Heading>
        <form onSubmit={handleSubmit}>

            <FormElement>
                <Label>
                    Username
                </Label>
                <Input type="text" placeholder="Type your username here" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
            </FormElement>

            <FormElement>
                <Label>
                    Password
                </Label>
                <Input type="password" placeholder="Type your password here" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
            </FormElement>

            <Alert hidden={true}>
                Enter correct details
            </Alert>
            <ButtonContainer>

                <Button type="submit">
                    Login
                </Button>
            </ButtonContainer>
        </form>
    </>)
}


async function SignInUser({ username, password }) {

    await axios.post('/api/auth/login', {
        username: username,
    }).then((response) => {
        console.log(response.data.body);
        const { email } = response.data.body

        const auth = getAuth(firebaseApp);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                user && (() => {
                    localStorage.setItem("tic-tac-toe-user", JSON.stringify(user));
                })();

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }).catch((error) => {
        console.log(error);
    });
}