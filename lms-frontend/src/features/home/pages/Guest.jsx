import Banner from "./Banner.jsx";
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";
import CourseList from "./CourseList.jsx";
import ProgramPanel from "../../program/pages/ProgramPanel.jsx";
import Introduce from "./Introduce.jsx";
import { featuredSubjects } from "@/mocks/homeDataMock.js";

import SubjectCard from "@/features/home/component/SubjectCard.jsx";

import { getListProgram } from "@/features/program/api/programService.js";
import { useEffect, useState } from "react";
import ProgramCard from "@/features/home/component/ProgramCard.jsx";

export const Guest = () => {
  const [programs, setPrograms] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { items } = await getListProgram();
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        setPrograms(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Lỗi khi load programs:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Banner />
      <Introduce />
      <div className="max-w-6xl mx-auto px-3 py-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-900">
          Chương Trình Nổi Bật
        </h2>
        <div className="grid">
          {programs.map((p) => (
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
