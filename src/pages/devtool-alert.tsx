import { Link, useSearchParams } from "react-router-dom";
import '../styles/devtool.css';

function DevtoolAlert() {
  const p = useSearchParams();
  const backUrl = `/${p[0].get("back")}` ?? "/";

  return (
    <main>
      <div className="devtool-alert">
        <h1>Opened Devtool Detected</h1>
        <p>You don't have permission to use Devtool!</p>
        <p>Please close your devtool!</p>
        <Link to={backUrl}>Back</Link>
      </div>
    </main>
  );
}

export default DevtoolAlert;
