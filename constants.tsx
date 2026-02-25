
import React from 'react';
import { LayoutDashboard, Target, CheckCircle, Grid3X3, Calendar, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import { LifeRole, Goal, Idea, Task } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'اللوحة الرئيسية', icon: <LayoutDashboard size={20} /> },
  { id: 'goals', label: 'الأهداف الجبارة', icon: <Target size={20} /> },
  { id: 'tasks', label: 'قائمة المهام', icon: <CheckCircle size={20} /> },
  { id: 'matrix', label: 'الخزنة (الأولويات)', icon: <Grid3X3 size={20} /> },
  { id: 'planner', label: 'المخطط الذكي', icon: <Calendar size={20} /> },
  { id: 'ai', label: 'الشريك الاستراتيجي', icon: <MessageCircle size={20} /> },
  { id: 'settings', label: 'الإعدادات والربط', icon: <SettingsIcon size={20} /> },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'تطوير منهج Creative Kids 2.0',
    objective: 'تحديث المحتوى التعليمي ليناسب التحول الرقمي',
    category: 'Work',
    deadline: '2024-06-30',
    progress: 45,
    keyResults: [
      { id: 'k1', text: 'إنهاء 10 وحدات تعليمية جديدة', completed: true },
      { id: 'k2', text: 'تصميم واجهة المستخدم الجديدة', completed: false },
      { id: 'k3', text: 'اختبار المنهج مع 50 طفل', completed: false }
    ]
  },
  {
    id: '2',
    title: 'رواية البطل الأخير',
    objective: 'نشر المسودة الأولى من الرواية',
    category: 'Creative',
    deadline: '2024-12-15',
    progress: 20,
    keyResults: [
      { id: 'k4', text: 'كتابة أول 5 فصول', completed: true },
      { id: 'k5', text: 'بناء الشخصيات الأساسية', completed: false }
    ]
  }
];

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'i1',
    title: 'تطبيق خريطة القرآن',
    description: 'تطبيق تفاعلي يربط الآيات ببعضها بصرياً',
    status: 'Incubating',
    type: 'Education',
    createdAt: '2024-01-10'
  }
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'مراجعة خطة الربع الثاني', urgent: true, important: true, completed: false, duration: 60 },
  { id: 't2', title: 'تجهيز عرض التقديم للمستثمرين', urgent: false, important: true, completed: false, duration: 90 }
];
