import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ScrollManager } from '@/components/layout/ScrollManager';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';
import { HomePage } from '@/routes/HomePage';
import { ProjectsPage } from '@/routes/ProjectsPage';
function PageTitle() { const location = useLocation(); useEffect(() => { document.title = location.pathname === '/projects' ? 'Projects · Vasanth Kumar' : 'Vasanth Kumar · AI & Machine Learning'; }, [location.pathname]); return null; }
export default function App() { return <BrowserRouter><PageTitle /><ScrollManager /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><ChatbotWidget /></BrowserRouter>; }
