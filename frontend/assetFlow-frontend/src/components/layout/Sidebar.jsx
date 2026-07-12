import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBuilding,
    FaUsers,
    FaBoxes,
    FaLaptop
} from "react-icons/fa";

const Sidebar = () => {

    const menuItems = [

        {
            title: "Dashboard",
            path: "/dashboard",
            icon: <FaHome />
        },

        {
            title: "Departments",
            path: "/departments",
            icon: <FaBuilding />
        },

        {
            title: "Employees",
            path: "/employees",
            icon: <FaUsers />
        },

        {
            title: "Categories",
            path: "/categories",
            icon: <FaBoxes />
        },

        {
            title: "Assets",
            path: "/assets",
            icon: <FaLaptop />
        }

    ];

    return (

        <aside className="sidebar">

            <div className="logo">

                <h2>AssetFlow</h2>

            </div>

            <nav>

                {

                    menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="nav-link"
                        >

                            <span>{item.icon}</span>

                            <span>{item.title}</span>

                        </NavLink>

                    ))

                }

            </nav>

        </aside>

    );

};

export default Sidebar;