import { Brain, Github, Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-foreground">
                NarrativeCheck
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden xs:block">
                KDSH 2026
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-4 sm:gap-6">
            <span className="text-xs font-mono text-muted-foreground">
              v1.0.0-beta
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="sm:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-3 pb-1 border-t border-border mt-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                v1.0.0-beta
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
