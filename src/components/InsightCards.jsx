import React from 'react';
import { Users, MessageSquare, Activity, CheckCircle, Briefcase } from 'lucide-react';
import './InsightCards.css';

const InsightCards = ({ type = "leads", metrics = {} }) => {
    
    let cards = [];
    
    if (type === 'leads') {
        cards = [
            { title: "TOTAL LEADS", value: metrics.total || 0, icon: <Users size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "NEW LEADS", value: metrics.newLeads || 0, icon: <Activity size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "IN CONVERSATION", value: metrics.inConversation || 0, icon: <MessageSquare size={20} className="icon-orange" />, bg: "bg-orange-light" },
            { title: "CONVERTED (PO)", value: metrics.converted || 0, icon: <CheckCircle size={20} className="icon-purple" />, bg: "bg-purple-light" },
        ];
    } else if (type === 'comments') {
        cards = [
            { title: "TOTAL COMMENTS", value: metrics.total || 0, icon: <Users size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "COMMENTS TODAY", value: metrics.today || 0, icon: <Activity size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "CONVERSATIONS TODAY", value: metrics.convToday || 0, icon: <MessageSquare size={20} className="icon-orange" />, bg: "bg-orange-light" },
            { title: "POS TODAY", value: metrics.poToday || 0, icon: <CheckCircle size={20} className="icon-purple" />, bg: "bg-purple-light" },
        ];
    }

    return (
        <div className="insights-grid">
            {cards.map((card, idx) => (
                <div key={idx} className="insight-card">
                    <div className="insight-header">
                        <span className="insight-title">{card.title}</span>
                        <div className={`insight-icon-wrapper ${card.bg}`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className="insight-value">{card.value}</div>
                </div>
            ))}
        </div>
    );
};

export default InsightCards;
