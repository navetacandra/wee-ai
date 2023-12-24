import { Link } from "react-router-dom";
import '../styles/alert.css';

function NotFoundAlert() {
  return (
    <main>
      <div className="page-alert">
        <h1>404</h1>
        <p>Page Not Found!</p>
        <Link to={'/'}>Home</Link>
      </div>
    </main>
  );
}

export default NotFoundAlert;
