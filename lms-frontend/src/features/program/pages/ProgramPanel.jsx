import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { useNavigate } from "react-router-dom";

import { programs } from "../../../mocks/mockPrograms.js";



const ProgramPanel = () => {
    const navigate = useNavigate();
    return (<>
        <div className="flex justify-content-center flex-wrap mt-4 mx-4 bg-white"><h2>Danh sách chương trình học 111 </h2><Divider />
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