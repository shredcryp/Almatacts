import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <>
            <div class="sidebar">
                
                <Link to="/addcontact">
                    <i class="fa fa-fw fa-wrench"></i> Add contact
                </Link>
                <Link to="/managecontacts">
                    <i class=""></i> Manage contacts
                </Link>
            </div>
        </>
    );
}

export default Sidebar;