import logo from "./img.png";
import { baseURL } from "../../urlConfig";

export function Home() {
  const image = <img src={logo}></img>;

  const text = (
    <div>
      <p>
        Have an account? Log in <a href="/login">here</a>.
      </p>
      <p>New to PetPal?</p>
      <p>Sign up as a shelter here.</p>
      <p>Sign up as a potential owner here.</p>
    </div>
  );

  return (
    <div>
      {image}
      {text}
    </div>
  );
}
