import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="bg-gray-100 w-64 h-screen p-4">
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/dashboard"
                            className="block p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/classes"
                            className="block p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                            Classes
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/exams"
                            className="block p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                            Exam
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/students"
                            className="block p-2 hover:bg-gray-200 rounded transition-colors"
                        >
                            Students
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
