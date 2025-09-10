import Banner from "./Banner.jsx";
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";
import CourseList from "./CourseList.jsx";
import ProgramPanel from "../../program/pages/ProgramPanel.jsx";
import Introduce from "./Introduce.jsx";
import {
  featuredPrograms,
  featuredSubjects,
} from "@/mocks/homeDataMock.js";
import ProgramCard from "@/features/home/component/ProgramCard.jsx";
import SubjectCard from "@/features/home/component/SubjectCard.jsx";

export const Guest = () => {
  return (
    <>
      <Banner />
      <Introduce />
      <div className="max-w-6xl mx-auto px-3 py-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-900">
          Chương Trình Nổi Bật
        </h2>
        <div className="grid">
          {featuredPrograms.map((p) => (
            <div key={p.id} className="col-12 md:col-6 lg:col-4">
              <ProgramCard program={p} />
            </div>
          ))}
        </div>
      </div>
      <div className="surface-50">
        <div className="max-w-6xl mx-auto px-3 py-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-900">
            Môn Học Nổi Bật
          </h2>
          <div className="grid">
            {featuredSubjects.map((s) => (
              <div key={s.id} className="col-12 md:col-6 lg:col-4">
                <SubjectCard subject={s} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <LayoutHomeFooter />
    </>
  );
};

export default Guest;
