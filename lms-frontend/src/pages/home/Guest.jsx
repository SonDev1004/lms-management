import Banner from "./Banner";
import LayoutHomeFooter from "../../layouts/home/LayoutHomeFooter";
import CourseList from "./CourseList";

export const Guest = () => {
    return (<>
        <Banner />
        <CourseList />
        <LayoutHomeFooter />

    </>
    );
}

export default Guest;