import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-50 py-4 sticky bottom-0 w-full animate-fade-in-up">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                {/* Texto */}
                <p className="text-sm mb-4 md:mb-0 text-balance text-center">
                    © 2026 Ilson Díaz. Desarrollado con React, Tailwind CSS y Spring Boot.
                </p>

                {/* Links */}
                <div className="flex space-x-4">
                    <a
                        href="https://github.com/ilson28"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                        title="GitHub"
                    >
                        <FaGithub size={20} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ilsondiaz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                        title="LinkedIn"
                    >
                        <FaLinkedin size={20} />
                    </a>
                    <a
                        href="https://tu-portafolio.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                        title="Portafolio"
                    >
                        Portafolio
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer