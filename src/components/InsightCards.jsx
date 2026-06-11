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
    } else if (type === 'dashboard-superadmin') {
        cards = [
            { title: "TOTAL COMPANIES", value: metrics.totalCompanies || 0, icon: <Briefcase size={20} className="icon-purple" />, bg: "bg-purple-light" },
            { title: "TOTAL USERS", value: metrics.totalUsers || 0, icon: <Users size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "TOTAL LEADS", value: metrics.totalLeads || 0, icon: <Activity size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "TOTAL COMMENTS", value: metrics.totalComments || 0, icon: <MessageSquare size={20} className="icon-orange" />, bg: "bg-orange-light" },
        ];
    } else if (type === 'dashboard-admin') {
        cards = [
            { title: "TOTAL LEADS", value: metrics.totalLeads || 0, icon: <Users size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "NEW LEADS", value: metrics.newLeads || 0, icon: <Activity size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "IN CONVERSATION", value: metrics.inConversation || 0, icon: <MessageSquare size={20} className="icon-orange" />, bg: "bg-orange-light" },
            { title: "POS", value: metrics.pos || 0, icon: <CheckCircle size={20} className="icon-purple" />, bg: "bg-purple-light" },
        ];
    } else if (type === 'users') {
        cards = [
            { title: "TOTAL USERS", value: metrics.total || 0, icon: <Users size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "TOTAL ADMINS", value: metrics.admins || 0, icon: <Briefcase size={20} className="icon-purple" />, bg: "bg-purple-light" },
            { title: "COMMENTS TODAY", value: metrics.commentsToday || 0, icon: <Activity size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "COMMENTS THIS MONTH", value: metrics.commentsThisMonth || 0, icon: <MessageSquare size={20} className="icon-orange" />, bg: "bg-orange-light" },
        ];
    } else if (type === 'companies') {
        cards = [
            { title: "TOTAL COMPANIES", value: metrics.total || 0, icon: <Briefcase size={20} className="icon-purple" />, bg: "bg-purple-light" },
            { title: "ACTIVE COMPANIES", value: metrics.active || metrics.total || 0, icon: <Activity size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "NEW THIS MONTH", value: metrics.newThisMonth || 0, icon: <Users size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "NEW THIS YEAR", value: metrics.newThisYear || 0, icon: <CheckCircle size={20} className="icon-orange" />, bg: "bg-orange-light" },
        ];
    } else if (type === 'pos') {
        cards = [
            { title: "TOTAL POs", value: metrics.total || 0, icon: <CheckCircle size={20} className="icon-purple" />, bg: "bg-purple-light" },
            { title: "POs THIS WEEK", value: metrics.thisWeek || 0, icon: <Activity size={20} className="icon-blue" />, bg: "bg-blue-light" },
            { title: "POs THIS MONTH", value: metrics.thisMonth || 0, icon: <Users size={20} className="icon-green" />, bg: "bg-green-light" },
            { title: "POs THIS YEAR", value: metrics.thisYear || 0, icon: <Briefcase size={20} className="icon-orange" />, bg: "bg-orange-light" },
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
