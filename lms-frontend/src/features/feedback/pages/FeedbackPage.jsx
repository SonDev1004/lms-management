// src/features/feedback/pages/FeedbackPage.jsx
import { useEffect, useRef, useState } from "react";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import "../styles/layout.css";
import { useFeedback } from "../hook/useFeedback";
import FeedbackFilter from "../components/FeedbackFilter";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import { FeedbackDetail } from "../detail";
import StatsBar from "../components/StatsBar";

import {
    addReply,
    createFeedback,
    updateStatus,
    getStats,
} from "../api/feedbackService";

import "../styles/feedback.css";

export default function FeedbackPage() {
    // default to segmented sorting “Date”
    const { state, refresh } = useFeedback({
        sort: "date",
        status: "All",
        rating: "All",
        time: "All Time",
    });

    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, avg: 0 });
    const toast = useRef(null);

    // load stats whenever the list changes
    useEffect(() => {
        getStats().then(setStats);
    }, [state.total]);

    const openDetail = (fb) => {
        setSelected(fb);
        setVisible(true);
    };

    const submit = async (payload) => {
        await createFeedback(payload);
        await refresh({ page: 0 });
        setStats(await getStats());
        toast.current?.show({
            severity: "success",
            summary: "Submitted",
            detail: "Thank you for your feedback!",
        });
    };

    const onChangeParams = (patch) => refresh(patch);
    const clearAll = () =>
        refresh({ q: "", course: "All", rating: "All", status: "All", time: "All Time", page: 0 });

    return (
        <div className="fb-page">
            <Toast ref={toast} />

            <div className="fb-hero fb-hero--tight">
                <div className="fb-hero__content">
                    <h1 className="fb-hero__title">Feedback & Reviews</h1>
                    <p className="fb-hero__desc">
                        Share your thoughts and help us improve our courses. Your feedback is valuable and helps
                        create a better learning experience for everyone.
                    </p>
                </div>
            </div>

            <div className="fb-container">
                {/* KPI stats (4 cards) */}
                <StatsBar stats={stats} />

                {/* Left: submit form */}
                <div className="fb-left">
                    <div className="fb-section">
                        <h3 className="fb-section__title">Submit Feedback</h3>
                        <FeedbackForm onSubmit={submit} />
                    </div>
                </div>

                {/* Right: list + filters */}
                <div className="fb-right">
                    <div className="fb-section">
                        <div className="fb-list-head">
                            <h3 className="fb-section__title">Feedback & Reviews ({state.total})</h3>
                        </div>

                        <FeedbackFilter
                            value={state.params}
                            onChange={onChangeParams}
                            onSearch={() => refresh({ page: 0 })}
                            onClear={clearAll}
                        />

                        <FeedbackList rows={state.rows} loading={state.loading} onOpen={openDetail} />

                        <Paginator
                            first={state.params.page * state.params.pageSize}
                            rows={state.params.pageSize}
                            totalRecords={state.total}
                            onPageChange={(e) => refresh({ page: e.page, pageSize: e.rows })}
                            className="fb-pager"
                        />
                    </div>
                </div>
            </div>

            <FeedbackDetail
                value={selected}
                visible={visible}
                onHide={() => setVisible(false)}
                onReply={async (text) => {
                    if (!selected) return;
                    await addReply(selected.id, {
                        message: text,
                        author: { id: "staff-self", name: "You" },
                    });
                    await refresh({});
                }}
                onStatus={async (status) => {
                    if (!selected) return;
                    await updateStatus(selected.id, status);
                    await refresh({});
                    setStats(await getStats());
                }}
            />
        </div>
    );
}
