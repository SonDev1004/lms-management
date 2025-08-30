import Banner from "./Banner";
import LayoutHomeFooter from "../../layouts/home/LayoutHomeFooter";
import CourseList from "./CourseList";
import ProgramPanel from "./ProgramPanel";
import Introduce from "./Introduce";

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