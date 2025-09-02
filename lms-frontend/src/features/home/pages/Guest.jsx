import Banner from "./Banner.jsx";
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";
import CourseList from "./CourseList.jsx";
import ProgramPanel from "../../program/pages/ProgramPanel.jsx";
import Introduce from "./Introduce.jsx";

export const Guest = () => {
    return (<>
        <Banner />
        <Introduce />
        <ProgramPanel />
        <CourseList />
        <LayoutHomeFooter />

    </>
    );
}

export default Guest;