export default function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-colors shadow-lg hover:shadow-primary/5 group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">{title}</h3>
            <p className="text-text-muted leading-relaxed">{desc}</p>
        </div>
    );
}
