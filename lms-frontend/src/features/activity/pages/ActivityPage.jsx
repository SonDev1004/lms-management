import React, {useEffect, useState} from 'react';
import ActivityList from '../components/ActivityList';
import {fetchActivities} from '../api/activityService';

const ActivityPage = ({course, student}) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        let mounted = true;
        fetchActivities(course?.id, student?.id).then((res) => {
            if (!mounted) return;
            setActivities(res);
        });
        return () => { mounted = false; };
    }, [course, student]);

    const isRecent = (d) => {
        if (!d) return false;
        return Date.now() - new Date(d).getTime() < 48 * 60 * 60 * 1000;
    };

    const formatFullDateTime = (d) => {
        if (!d) return '';
        const dt = d instanceof Date ? d : new Date(d);
        if (isNaN(dt)) return d;
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        const hh = String(dt.getHours()).padStart(2, '0');
        const mm = String(dt.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} • ${hh}:${mm}`;
    };

    const timeAgo = (d) => {
        if (!d) return '';
        const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
        if (diff < 60) return `${diff}s trước`;
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    return (
        <ActivityList activities={activities} isRecent={isRecent} formatFullDateTime={formatFullDateTime} timeAgo={timeAgo}/>
    );
};

export default ActivityPage;
