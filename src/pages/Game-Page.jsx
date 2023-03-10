import ActionBar from "../components/ActionBar";
import Heading from "../components/Heading"
import { Input, FormElement, Label } from "../components/form-elements";
import Button from "../components/Button";
import ButtonContainer from "../components/ButtonContainer";
import Game from "./game/Game";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

// Firebase 
import { doc, collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { firebaseApp } from "../libs/firebaseConfig";

export default function GamePage() {
    const router = useRouter();
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("tic-tac-toe-user"))) {
            const { uid } = JSON.parse(localStorage.getItem("tic-tac-toe-user"));
            const CheckId = async (uid) => {
                await axios.post('/api/auth/uid', {
                    uid: uid,
                }).then((response) => {
                    if (!response.data.body.isValid)
                        router.push("/")

                }).catch((error) => {
                    console.log(error);
                    return {
                        error: error
                    }
                });
            }
            CheckId(uid)
        }
    }, [router]);

    const [canStart, setStart] = useState(false)
    const [email, setEmail] = useState("");
    const [opponent, setOpponent] = useState({});

    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);




    const CheckForEmail = async (email) => {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setOpponent(doc.data());
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        console.log(currentUser)
        if (currentUser.providerData[0].email === email) {
            console.log("Sorry but cannot play alone")
        }
        else {
            CheckForEmail(email)
        }
    }
    const resetOpponent = () => {
        setOpponent({})
        setEmail("")
    }
    useEffect(() => {
        if (Object.keys(opponent).length > 2)
            setStart(true)
    }, [opponent]);


    return (<>
        <ActionBar>
            <Link href="/game" onClick={resetOpponent}>
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
            <Link href="/logout" onClick={resetOpponent}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z" /><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </Link>
        </ActionBar>


        {canStart ? <Game opponentData={opponent} /> : <>
            <p>Start a new game</p>
            <Heading>Whom do you want to play with?</Heading>
            <form onSubmit={handleSubmit}>
                <FormElement>
                    <Label>Email</Label>
                    <Input type="email" placeholder="Type your email here" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormElement>
                <ButtonContainer type="submit">

                    <Button>Start Game</Button>
                </ButtonContainer>
            </form>
        </>}




    </>)
}