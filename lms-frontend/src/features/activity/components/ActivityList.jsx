import React from 'react';
import {Card} from 'primereact/card';
import {Badge} from 'primereact/badge';
import classNames from 'classnames';

const ActivityList = ({activities, isRecent, formatFullDateTime, timeAgo}) => {
    return (
        <div className="activity-list p-mt-2">
            {activities.map((a) => (
                <Card key={a.id} className={classNames('activity-item', {recent: isRecent(a.date)})}>
                    <div className="p-d-flex p-ai-start p-jc-between">
                        <div style={{width: 64}}>
                            {isRecent(a.date) ? <Badge value="Mới" severity="success" className="activity-badge"/> :
                                <div className="activity-spacer"/>}
                        </div>
                        <div className="activity-content" style={{flex: 1}}>
                            <div className="activity-top p-d-flex p-jc-between p-ai-start">
                                <div className="activity-text"><strong className="activity-title">{a.text}</strong></div>
                                <div className="activity-time small-muted">{formatFullDateTime(a.date)}
                                    <span style={{marginLeft: 8, fontSize: 12, color: '#94a3b8'}}>({timeAgo(a.date)})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ActivityList;
