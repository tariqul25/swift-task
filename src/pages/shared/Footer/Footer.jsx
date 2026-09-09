import React from 'react';
import {
  Github,
  Linkedin,
  Facebook,
  Twitter,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MapPin,
  Heart
} from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Swift<span className="text-primary-light">Tasks</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              The premium decentralized micro-tasking ecosystem. Empowering workers to earn reliably and helping businesses scale their digital workforce seamlessly.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/tariqul25"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/tariqul25/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#0A66C2] text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/tariqul25"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#1877F2] text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/tariqul025"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X Profile"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              For Workers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/register" className="hover:text-primary-light transition-colors">
                  Create Worker Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-light transition-colors">
                  Available Micro-Tasks
                </Link>
              </li>
              <li>
                <Link to="/dashboard/withdrawals" className="hover:text-primary-light transition-colors">
                  Withdrawal Rates
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-submission" className="hover:text-primary-light transition-colors">
                  Submission Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              For Task Buyers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/register" className="hover:text-primary-light transition-colors">
                  Post New Task
                </Link>
              </li>
              <li>
                <Link to="/dashboard/purchase" className="hover:text-primary-light transition-colors">
                  Purchase Coins
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-tasks" className="hover:text-primary-light transition-colors">
                  Manage Campaigns
                </Link>
              </li>
              <li>
                <Link to="/dashboard/payments" className="hover:text-primary-light transition-colors">
                  Invoices & Receipts
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Trust & Escrow
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold">SSL 256-Bit Encryption</span>
              </div>
              <p>
                All funds are deposited into audited escrow pools. Instant automated verification.
              </p>
              <div className="pt-2 flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-primary-light" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-800/80 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SwiftTasks Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Escrow Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
