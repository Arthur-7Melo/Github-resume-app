import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-gray-600 dark:text-gray-400'>
        <div className='text-sm'>
          <p> © {new Date().getFullYear()} Arthur Melo</p>
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="https://github.com/Arthur-7Melo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="GitHub"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/arthur-melo-47040621a"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}