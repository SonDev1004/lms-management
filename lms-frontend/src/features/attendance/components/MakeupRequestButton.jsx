import {useState, useRef} from "react";
import PropTypes from "prop-types";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {InputTextarea} from "primereact/inputtextarea";
import {Toast} from "primereact/toast";
import {createStudentMakeupRequest} from "@/features/attendance/api/makeupRequestService.js";

export default function MakeupRequestButton({sessionId, disabled}) {
    const [visible, setVisible] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const open = () => setVisible(true);
    const close = () => {
        setVisible(false);
        setReason("");
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await createStudentMakeupRequest(sessionId, reason);
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Yêu cầu học bù đã được gửi tới phòng đào tạo.",
            });
            close();
        } catch (err) {
            const detail =
                err?.response?.data?.message ||
                "Không gửi được yêu cầu học bù. Vui lòng thử lại.";
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast}/>

            <Button
                label="Xin học bù"
                size="small"
                text
                onClick={open}
                disabled={disabled || !sessionId}
            />

            <Dialog
                header="Xin học bù cho buổi này"
                visible={visible}
                onHide={close}
                style={{width: "420px"}}
                modal
            >
                <p>Vui lòng nhập lý do xin học bù cho buổi học này.</p>
                <InputTextarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    style={{width: "100%", marginTop: 8}}
                    autoFocus
                />

                <div style={{marginTop: 16, textAlign: "right"}}>
                    <Button
                        label="Hủy"
                        text
                        className="p-mr-2"
                        onClick={close}
                        disabled={loading}
                    />
                    <Button
                        label="Gửi yêu cầu"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!reason?.trim()}
                    />
                </div>
            </Dialog>
        </>
    );
}

MakeupRequestButton.propTypes = {
    sessionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    disabled: PropTypes.bool,
};
