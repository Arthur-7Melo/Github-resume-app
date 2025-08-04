import { useState, useEffect } from "react";
import { Moon, Sun } from 'lucide-react'

export default function Header() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem("theme", newTheme);
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || 'light';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, [])


  return (
    <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-700 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1
          className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-transform transform hover:scale-105 active:scale-95 hover:cursor-pointer"
        >
          Github Insights
        </h1>

        <button
          onClick={toggleTheme}
          className="rounded-full p-2 shadow-md shadow-blue-400 cursor-pointer text-gray-600 hover:text-blue-400 transition-all ease-in-out dark:bg-white dark:shadow-amber-400 dark:hover:text-amber-400"
        >
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
      </div>
    </header>
  )
}