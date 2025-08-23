import Banner from "./Banner";
import LayoutHomeFooter from "../../layouts/home/LayoutHomeFooter";
import CourseList from "./CourseList";
import ProgramPanel from "./ProgramPanel";

export const Guest = () => {
    return (<>
        <Banner />
        <CourseList />
        <ProgramPanel />
        <LayoutHomeFooter />

    </>
    );
}

export default Guest;