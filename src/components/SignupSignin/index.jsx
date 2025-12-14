import React from "react";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db, doc, provider, setDoc } from "../../firebase";
import { getDoc } from "firebase/firestore";
import "./styles.css";
import Input from "../input";
import Button from "../Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupSigninComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail(e) {
    e.preventDefault();
    setLoading(true);
    // 1. Check empty fields
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are mandatory!");
      setLoading(false);
      return;
    }

    // 2. Check password match (THIS IS WHERE IT GOES)
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    // 3. Create user using Firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // The user has been authenticated.
        const user = userCredential.user;
        console.log("user", user);
        toast.success("User created! Please log in");
        setLoginForm(true);
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        createDoc(user);
      })
      .catch((error) => {
        // There was an error during authentication.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
  }

  function loginUsingEmail(e) {
    e.preventDefault();
    setLoading(true);
    // 1. Check empty fields
    if (!email || !password) {
      toast.error("All fields are mandatory!");
      setLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("User Logged In!");
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          toast.error("Invalid email or password!");
          return;
        }
        toast.error(errorMessage);
      });
  }

  async function createDoc(user) {
    setLoading(true);
    //make sure the doc with uid doesn't exist
    if (!user) return;

    const useRef = doc(db, "users", user.uid);
    const userData = await getDoc(useRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        toast.success("User Authenticated!");
        createDoc(user);
        navigate("/dashboard");
        setLoading(false);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(errorMessage);
        setLoading(false);
        // ...
      });
  }
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login into{" "}
            <span style={{ color: "var(--theme)" }}>QuantifyMe.</span>{" "}
          </h2>
          <form>
            <Input
              type={"email"}
              label={"email"}
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              type={"password"}
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={(e) => loginUsingEmail(e)}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
              onClick={googleAuth}
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
            />
            <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
              {" "}
              Or Don't Have An Account?{" "}
              <span
                onClick={() => setLoginForm(!loginForm)}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "var(--theme)",
                }}
              >
                Click Here
              </span>
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on{" "}
            <span style={{ color: "var(--theme)" }}>QuantifyMe.</span>{" "}
          </h2>
          <form>
            <Input
              type={"text"}
              label={"full Name"}
              state={name}
              setState={setName}
              placeholder={"John Doe"}
            />
            <Input
              type={"email"}
              label={"email"}
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              type={"password"}
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type={"password"}
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup Using Email and Password"}
              onClick={(e) => signupWithEmail(e)}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
              onClick={googleAuth}
              disabled={loading}
              text={loading ? "Loading..." : "Signup Using Google"}
              blue={true}
            />
            <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
              {" "}
              Or Have An Account Already?{" "}
              <span
                onClick={() => setLoginForm(!loginForm)}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "var(--theme)",
                }}
              >
                Click Here
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSigninComponent;
