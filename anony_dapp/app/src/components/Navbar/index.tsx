import style from "./style.module.css";
import { useWeb3Store } from "../../states";
function Navbar() {
  const { wallet, connectWallet } = useWeb3Store() as any;
  return (
    <div className={style.navbar}>
      <button onClick={connectWallet}>{wallet}</button>
    </div>
  );
}

export default Navbar;
