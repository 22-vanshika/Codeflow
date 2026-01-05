import HeroSection from '../features/home/components/HeroSection';
import FeaturesGrid from '../features/home/components/FeaturesGrid';

export default function Home() {
    return (
        <div className="min-h-screen pt-[56px] flex flex-col bg-background selection:bg-primary/30">
            <HeroSection />
            <FeaturesGrid />
            <footer className="py-8 text-center text-text-muted text-sm border-t border-white/5 bg-background">
                <p>© 2025 CodeFlow.</p>
            </footer>
        </div>
    );
}

