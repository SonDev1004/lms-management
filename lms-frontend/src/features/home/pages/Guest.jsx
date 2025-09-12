import Banner from "./Banner.jsx";
import LayoutHomeFooter from "layouts/home/LayoutHomeFooter.jsx";
import Introduce from "./Introduce.jsx";

import SubjectCard from "@/features/home/component/SubjectCard.jsx";

import { getListProgram } from "@/features/program/api/programService.js";
import { useEffect, useState } from "react";
import ProgramCard from "@/features/home/component/ProgramCard.jsx";
import {getListSubject} from "@/features/subject/api/subjectService.js";

export const Guest = () => {
  const [programs, setPrograms] = useState([]);
    const [subjects, setSubject] = useState([])
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { items } = await getListSubject();
                const shuffled = [...items].sort(() => 0.5 - Math.random());
                setSubject(shuffled.slice(0, 3));
            } catch (err) {
                console.error("Lỗi khi load subject:", err);
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
            {subjects.map((s) => (
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
