import { useLocation } from "react-router-dom";

const PageTitle = () => {

    const location = useLocation();

    const titles = {

        "/dashboard": "Dashboard",
        "/departments": "Departments",
        "/employees": "Employees",
        "/categories": "Categories",
        "/assets": "Assets"

    };

    return (

        <h2>

            {titles[location.pathname] || "AssetFlow"}

        </h2>

    );

};

export default PageTitle;