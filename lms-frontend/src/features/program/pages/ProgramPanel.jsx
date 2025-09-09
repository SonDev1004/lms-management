import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { useNavigate } from "react-router-dom";

import { programs } from "../../../mocks/mockPrograms.js";

//import { toSlug } from "utils/slugify";


const ProgramPanel = () => {
    const navigate = useNavigate();
    return (<>

        <div className="relative bg-white mt-4 mx-4 pb-2">
            <div className=" flex justify-content-end flex-wrap">
                <a
                    className="hover:underline text-xl cursor-pointer  px-4 pt-4"
                    onClick={() => navigate(`/program`)}
                >
                    Xem tất cả
                </a>
            </div>
            <h2 className="text-3xl font-bold text-center">
                Chương trình nỗi bật
            </h2>
            <Divider className="m-0" />
        </div>
        <Panel className="mx-4" >
            <div className="grid p-fluid">
                {programs.map((program, idx) => (
                    <div className=" md:col-4" key={idx}>
                        <div><b>{program.tag}</b></div>
                        <Button
                            label={program.title}
                            icon={program.icon}
                            onClick={() => navigate(`/program/${program.id}`)}
                        />

                    </div>
                ))}
            </div>
        </Panel>
    </>);
}

export default ProgramPanel;