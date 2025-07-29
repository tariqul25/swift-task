import React from 'react';
import { Github, Linkedin, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 mb-6 md:mb-0">
                            <span className="text-2xl font-bold">SwiftTasks</span>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex space-x-6">
                        <a
                            href="https://github.com/your-username"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Github className="w-6 h-6" />
                        </a>
                        <a
                            href="https://linkedin.com/in/your-profile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a
                            href="https://facebook.com/your-profile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a
                            href="https://twitter.com/your-profile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Twitter className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p> © {new Date().getFullYear()} SwiftTasks Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
