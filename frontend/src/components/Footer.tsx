import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 px-8 border-t border-border-subtle bg-black/20 backdrop-blur-xl relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          
          {/* Logo and Description */}
          <div className="col-span-2 flex flex-col text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg shadow-primary/10">
                <div className="w-full h-full bg-bg-main rounded-xl flex items-center justify-center font-black text-white text-xs">CF</div>
              </div>
              <span className="text-text-primary font-black tracking-tight text-lg">CodeFlow</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-6 font-medium">
              The visual code debugger for algorithms and data structures. See logic execute in real time.
            </p>
            <p className="text-text-muted text-xs italic font-semibold">
              Hope you enjoy!
            </p>
          </div>

          {/* Product Column */}
          <div className="flex flex-col text-left gap-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-primary">Product</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/workspace" className="hover:text-primary transition-colors">Visualizer</a></li>
              <li><a href="/sheet" className="hover:text-primary transition-colors">DSA Sheet</a></li>
              <li><a href="/workspace" className="hover:text-primary transition-colors">Sandbox Arena</a></li>
              <li><span className="text-text-muted text-xs bg-white/5 px-2 py-0.5 rounded border border-white/5">v1.2.0</span></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col text-left gap-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-primary">Resources</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/docs" className="hover:text-primary transition-colors flex items-center gap-1.5">Documentation <ExternalLink size={11} /></Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/algorithm" className="hover:text-primary transition-colors">Algorithm Guide</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col text-left gap-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-primary">Company</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/roadmap" className="hover:text-primary transition-colors">Roadmap</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border-subtle pt-8 gap-4">
          <p className="text-text-muted text-xs">
            © 2026 CodeFlow. Visualizing algorithms, memory frames, and compiler execution steps.
          </p>
          <p className="text-text-muted text-xs italic">
            Built for developers, by developers.
          </p>
        </div>

      </div>
    </footer>
  );
}
