import { useEffect, useState } from "react";
import firebase from "firebase";
import { auth } from "../firebase/auth";
import { customValidation } from "../utils/customValidation";
import { addParticularData } from "../utils/localstorage";
import { useDispatch } from "react-redux";
import { setUserAuthId } from "../redux/actions/action";
import { useHistory } from "react-router";
import { decodeData } from "../utils/function";

const initialState = {
  email: "",
  password: "",
};

const useSignIn = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const history = useHistory();
  const [signIn, setSignIn] = useState(initialState);
  const [error, setError] = useState({});

  const handleSignIn = ({ target }) => {
    const { name, value } = target;
    setSignIn({ ...signIn, [name]: value });
    setError({ ...error, [name]: customValidation(name, value) });
  };

  const fetchCurrentUser = async () => {
    try {
      const isConfirmingEmail = urlParams.get("confirm_email");
      if (!!isConfirmingEmail) {
        const response = await auth.signInWithEmailAndPassword()
        if(response?.user){
          console.log('response', response);
        }
      }
    } catch (error) {
      console.log("error :", error?.code);
    }
  };

  useEffect(()=>{
    if(urlParams){
      fetchCurrentUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const formData = [
    {
      name: "email",
      value: signIn.email,
      label: "Email Address",
      type: "email",
      placeholder: "someone@gmail.xyz",
    },
    {
      name: "password",
      value: signIn.password,
      label: "Password",
      type: "password",
      placeholder: "************",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("signIn :", signIn);
  };

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        addParticularData("token", result?.user?.Aa);
        const data = decodeData(result?.user?.Aa);
        const object = {
          id: data?.user_id,
          authId: data?.user_id,
          logged: data?.user_id ? true : false,
          isLoginSuccess: data?.user_id ? true : false,
          user: data,
        };
        dispatch(setUserAuthId(object));
        console.log(`result`, result);
        history.push("/dashboard/" + result?.user?.uid);
      })
      .catch((error) => {
        console.log("error :", error);
      });
  };

  return [
    signIn,
    handleSignIn,
    handleSubmit,
    formData,
    handleGoogleSignIn,
    error,
  ];
};

export default useSignIn;
